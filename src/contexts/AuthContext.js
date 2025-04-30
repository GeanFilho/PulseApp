// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc 
} from 'firebase/firestore';

// Cria o contexto
const AuthContext = createContext(null);

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Monitorar estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Buscar dados adicionais do usuário no Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            const fullUser = {
              id: user.uid,
              name: userData.name,
              email: userData.email,
              department: userData.department,
              role: userData.role
            };
            
            setCurrentUser(fullUser);
            setIsAdmin(userData.role === 'admin');
          } else {
            // Se o documento do usuário não existir, criar um básico
            console.log('Documento de usuário não encontrado, criando documento básico');
            await setDoc(doc(db, "users", user.uid), {
              name: user.displayName || 'Usuário',
              email: user.email,
              department: 'Não definido',
              role: 'employee',
              createdAt: new Date()
            });
            
            setCurrentUser({
              id: user.uid,
              name: user.displayName || 'Usuário',
              email: user.email,
              department: 'Não definido',
              role: 'employee'
            });
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          setCurrentUser(null);
          setIsAdmin(false);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Função de registro de usuário
  const register = async (userData) => {
    try {
      const { name, email, password, department, role } = userData;
      
      // Criar usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Salvar dados adicionais no Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        department,
        role: role || 'employee',
        createdAt: new Date()
      });
      
      return {
        id: user.uid,
        name,
        email,
        department,
        role: role || 'employee'
      };
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  // Função de login
  const login = async (email, password) => {
    try {
      // Fazer login no Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Buscar dados adicionais do usuário no Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        return {
          id: user.uid,
          name: userData.name,
          email: userData.email,
          department: userData.department,
          role: userData.role
        };
      } else {
        throw new Error('Dados de usuário não encontrados');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  // Função para atualizar o perfil do usuário
  const updateProfile = async (userData) => {
    if (!currentUser) return null;
    
    try {
      // Atualizar dados no Firestore
      await setDoc(doc(db, "users", currentUser.id), userData, { merge: true });
      
      // Atualizar o estado local
      setCurrentUser({
        ...currentUser,
        ...userData
      });
      
      // Atualizar isAdmin se o papel foi alterado
      if (userData.role) {
        setIsAdmin(userData.role === 'admin');
      }
      
      return {
        ...currentUser,
        ...userData
      };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  // Valores expostos pelo contexto
  const value = {
    currentUser,
    isAdmin,
    register,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;