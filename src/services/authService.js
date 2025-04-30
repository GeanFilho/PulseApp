import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
  } from 'firebase/auth';
  import { 
    doc, 
    setDoc, 
    getDoc 
  } from 'firebase/firestore';
  import { auth, db } from '../firebase';
  
  // Registro de usuário
  export const registerUser = async (userData) => {
    const { name, email, password, department, role = 'employee' } = userData;
    
    try {
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Salvar dados adicionais no Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        department,
        role,
        createdAt: new Date()
      });
      
      return {
        id: user.uid,
        name,
        email,
        department,
        role
      };
    } catch (error) {
      throw new Error(`Erro ao registrar: ${error.message}`);
    }
  };
  
  // Login de usuário
  export const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Buscar dados adicionais do usuário
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
      throw new Error(`Erro ao fazer login: ${error.message}`);
    }
  };
  
  // Logout
  export const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(`Erro ao fazer logout: ${error.message}`);
    }
  };
  
  // Verificar estado de autenticação atual
  export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        
        if (user) {
          try {
            // Buscar dados adicionais do usuário
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              
              resolve({
                id: user.uid,
                name: userData.name,
                email: userData.email,
                department: userData.department,
                role: userData.role
              });
            } else {
              resolve(null);
            }
          } catch (error) {
            reject(error);
          }
        } else {
          resolve(null);
        }
      }, reject);
    });
  };