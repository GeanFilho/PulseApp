// src/firebase-init.js
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
  } from 'firebase/auth';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  import { auth, db } from './firebase';
  
  // Função para criar usuários de demonstração
  export const initializeDemoUsers = async () => {
    console.log('Verificando usuários de demonstração...');
    
    // Dados dos usuários de demonstração
    const demoUsers = [
      {
        email: 'admin@exemplo.com',
        password: 'senha123',
        name: 'Administrador Demo',
        department: 'RH',
        role: 'admin'
      },
      {
        email: 'usuario@exemplo.com',
        password: 'senha123',
        name: 'Usuário Demo',
        department: 'Desenvolvimento',
        role: 'employee'
      }
    ];
    
    for (const user of demoUsers) {
      try {
        // Verificar se o usuário já existe no Firestore
        const usersWithEmail = await checkUserExists(user.email);
        
        if (!usersWithEmail) {
          // Criar o usuário no Authentication
          console.log(`Criando usuário: ${user.email}`);
          try {
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              user.email,
              user.password
            );
            
            // Criar o perfil no Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
              name: user.name,
              email: user.email,
              department: user.department,
              role: user.role,
              createdAt: new Date()
            });
            
            console.log(`Usuário ${user.email} criado com sucesso!`);
          } catch (error) {
            // Se o erro for que o usuário já existe na autenticação
            if (error.code === 'auth/email-already-in-use') {
              console.log(`Usuário ${user.email} já existe na autenticação.`);
              
              // Tentar fazer login para obter o UID
              try {
                const userCredential = await signInWithEmailAndPassword(
                  auth,
                  user.email,
                  user.password
                );
                
                // Verificar se o perfil existe no Firestore
                const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
                
                if (!userDoc.exists()) {
                  // Se não existir, criar o perfil
                  await setDoc(doc(db, 'users', userCredential.user.uid), {
                    name: user.name,
                    email: user.email,
                    department: user.department,
                    role: user.role,
                    createdAt: new Date()
                  });
                  
                  console.log(`Perfil para ${user.email} criado com sucesso!`);
                }
              } catch (loginError) {
                console.error(`Erro ao fazer login como ${user.email}:`, loginError);
              }
            } else {
              console.error(`Erro ao criar usuário ${user.email}:`, error);
            }
          }
        } else {
          console.log(`Usuário ${user.email} já existe.`);
        }
      } catch (error) {
        console.error(`Erro ao verificar usuário ${user.email}:`, error);
      }
    }
  };
  
  // Função para verificar se um usuário com determinado email já existe
  const checkUserExists = async (email) => {
    try {
      // Buscar usuários com o email especificado
      const querySnapshot = await db
        .collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();
      
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Erro ao verificar se o usuário existe:', error);
      return false;
    }
  };
  
  // Função para inicializar o Firebase (deve ser chamada no início da aplicação)
  export const initializeFirebase = async () => {
    try {
      // Inicializar usuários de demonstração
      await initializeDemoUsers();
      
      console.log('Firebase inicializado com sucesso!');
    } catch (error) {
      console.error('Erro ao inicializar Firebase:', error);
    }
  };