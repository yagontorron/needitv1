import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Need, Category } from '@/types';
import mockNeeds from '@/data/mockNeeds';
import mockCategories from '@/data/mockCategories';

interface NeedsContextProps {
  needs: Need[];
  categories: Category[];
  userNeeds: Need[];
  isLoading: boolean;
  addNeed: (need: Omit<Need, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<Need>;
  updateNeed: (id: string, data: Partial<Need>) => Promise<void>;
  deleteNeed: (id: string) => Promise<void>;
  getNeedById: (id: string) => Need | undefined;
  getUserNeeds: (userId: string) => Promise<Need[]>;
  getSavedNeeds: (userId: string) => Promise<Need[]>;
  toggleSaveNeed: (needId: string) => Promise<void>;
}

const NeedsContext = createContext<NeedsContextProps>({
  needs: [],
  categories: [],
  userNeeds: [],
  isLoading: true,
  addNeed: async () => ({ id: '', userId: '', title: '', description: '', categoryId: '', images: [], createdAt: 0, updatedAt: 0, status: 'active' }),
  updateNeed: async () => {},
  deleteNeed: async () => {},
  getNeedById: () => undefined,
  getUserNeeds: async () => [],
  getSavedNeeds: async () => [],
  toggleSaveNeed: async () => {},
});

export const NeedsProvider = ({ children }: { children: ReactNode }) => {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [userNeeds, setUserNeeds] = useState<Need[]>([]);
  const [savedNeeds, setSavedNeeds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNeeds(mockNeeds);
        setCategories(mockCategories);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const addNeed = async (need: Omit<Need, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Need> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newNeed: Need = {
      ...need,
      id: `need_${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'active',
    };
    
    setNeeds(prevNeeds => [newNeed, ...prevNeeds]);
    setUserNeeds(prevUserNeeds => [newNeed, ...prevUserNeeds]);
    
    return newNeed;
  };

  const updateNeed = async (id: string, data: Partial<Need>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setNeeds(prevNeeds => 
      prevNeeds.map(need => 
        need.id === id 
          ? { ...need, ...data, updatedAt: Date.now() } 
          : need
      )
    );
    
    setUserNeeds(prevUserNeeds => 
      prevUserNeeds.map(need => 
        need.id === id 
          ? { ...need, ...data, updatedAt: Date.now() } 
          : need
      )
    );
  };

  const deleteNeed = async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setNeeds(prevNeeds => prevNeeds.filter(need => need.id !== id));
    setUserNeeds(prevUserNeeds => prevUserNeeds.filter(need => need.id !== id));
  };

  const getNeedById = (id: string) => {
    return needs.find(need => need.id === id);
  };

  const getUserNeeds = async (userId: string): Promise<Need[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const filteredNeeds = needs.filter(need => need.userId === userId);
    setUserNeeds(filteredNeeds);
    return filteredNeeds;
  };

  const getSavedNeeds = async (userId: string): Promise<Need[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return needs.filter(need => savedNeeds.includes(need.id));
  };

  const toggleSaveNeed = async (needId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setSavedNeeds(prevSavedNeeds => {
      if (prevSavedNeeds.includes(needId)) {
        return prevSavedNeeds.filter(id => id !== needId);
      } else {
        return [...prevSavedNeeds, needId];
      }
    });
  };

  return (
    <NeedsContext.Provider
      value={{
        needs,
        categories,
        userNeeds,
        isLoading,
        addNeed,
        updateNeed,
        deleteNeed,
        getNeedById,
        getUserNeeds,
        getSavedNeeds,
        toggleSaveNeed,
      }}
    >
      {children}
    </NeedsContext.Provider>
  );
};

export const useNeeds = () => useContext(NeedsContext);