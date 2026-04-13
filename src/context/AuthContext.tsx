import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { firebaseAuth, googleProvider } from '../config/fireBase';
import type { AuthState } from '../types/auth';

interface AuthContextValue extends AuthState {
  signWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    error: null,
    loading: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (user) => {
        console.log('👤 USER:', user);

        if (user) {
          setAuthState({
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            error: null,
            loading: false,
          });
        } else {
          setAuthState({
            user: null,
            error: null,
            loading: false,
          });
        }
      },
      (error) => {
        console.error('Erro na autenticação:', error);
        setAuthState({ user: null, error: error.message, loading: false });
      },
    );

    return () => unsubscribe();
  }, []);

  const getToken = async (): Promise<string | null> => {
    const user = firebaseAuth.currentUser;

    if (!user) {
      console.log('❌ SEM USER PRA GERAR TOKEN');
      return null;
    }

    const token = await user.getIdToken();

    console.log('🔥 TOKEN:', token);

    return token;
  };

  const signWithGoogle = async (): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true }));

      await signInWithPopup(firebaseAuth, googleProvider);
    } catch (err) {
      setAuthState({
        user: null,
        error: 'Erro ao autenticar com Google',
        loading: false,
      });
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(firebaseAuth);

      setAuthState({
        user: null,
        error: null,
        loading: false,
      });
    } catch (err) {
      setAuthState((prev) => ({
        ...prev,
        error: 'Erro ao fazer logout',
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signWithGoogle,
        signOut,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};
