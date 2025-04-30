// src/services/userService.js
import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    query, 
    where,
    orderBy,
    limit,
    serverTimestamp 
  } from 'firebase/firestore';
  import { db } from '../firebase';
  
  // Obter um usuário pelo ID
  export const getUserById = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (userDoc.exists()) {
        return {
          id: userDoc.id,
          ...userDoc.data()
        };
      } else {
        throw new Error('Usuário não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  };
  
  // Atualizar dados do usuário
  export const updateUser = async (userId, userData) => {
    try {
      // Adicionar timestamp de atualização
      const updatedData = {
        ...userData,
        updatedAt: serverTimestamp()
      };
      
      // Atualizar no Firestore (apenas os campos fornecidos)
      await setDoc(doc(db, "users", userId), updatedData, { merge: true });
      
      // Buscar o usuário atualizado
      return await getUserById(userId);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };
  
  // Buscar todos os usuários (para admin)
  export const getAllUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = [];
      
      querySnapshot.forEach((doc) => {
        // Não incluir a senha nos dados do usuário
        const { password, ...userData } = doc.data();
        
        users.push({
          id: doc.id,
          ...userData
        });
      });
      
      return users;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  };
  
  // Buscar usuários por departamento
  export const getUsersByDepartment = async (department) => {
    try {
      const q = query(
        collection(db, "users"),
        where("department", "==", department)
      );
      
      const querySnapshot = await getDocs(q);
      const users = [];
      
      querySnapshot.forEach((doc) => {
        // Não incluir a senha nos dados do usuário
        const { password, ...userData } = doc.data();
        
        users.push({
          id: doc.id,
          ...userData
        });
      });
      
      return users;
    } catch (error) {
      console.error('Erro ao buscar usuários por departamento:', error);
      throw error;
    }
  };
  
  // Buscar usuários mais recentes
  export const getRecentUsers = async (limitCount = 5) => {
    try {
      const q = query(
        collection(db, "users"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const users = [];
      
      querySnapshot.forEach((doc) => {
        // Não incluir a senha nos dados do usuário
        const { password, ...userData } = doc.data();
        
        users.push({
          id: doc.id,
          ...userData
        });
      });
      
      return users;
    } catch (error) {
      console.error('Erro ao buscar usuários recentes:', error);
      throw error;
    }
  };
  
  // Buscar todos os departamentos únicos
  export const getAllDepartments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const departments = new Set();
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.department) {
          departments.add(userData.department);
        }
      });
      
      return Array.from(departments);
    } catch (error) {
      console.error('Erro ao buscar departamentos:', error);
      throw error;
    }
  };
  
  // Exportar todos os serviços
  export default {
    getUserById,
    updateUser,
    getAllUsers,
    getUsersByDepartment,
    getRecentUsers,
    getAllDepartments
  };