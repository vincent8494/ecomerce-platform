import 'react-router';

declare module 'react-router' {
  export function useHistory(): {
    push: (path: string, state?: any) => void;
    replace: (path: string, state?: any) => void;
    goBack: () => void;
    goForward: () => void;
    location: {
      pathname: string;
      search: string;
      hash: string;
      state: any;
      key: string;
    };
  };

  export function useParams<T = {}>(): T;
  export function useLocation(): {
    pathname: string;
    search: string;
    hash: string;
    state: any;
    key: string;
  };
}
