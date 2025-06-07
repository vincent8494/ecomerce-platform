// Type definitions for Facebook JavaScript SDK

interface Window {
  FB: {
    init: (params: {
      appId: string;
      cookie?: boolean;
      xfbml?: boolean;
      version: string;
    }) => void;
    login: (callback: (response: any) => void, options?: { scope: string }) => void;
  };
  
  google: {
    accounts: {
      oauth2: {
        initCodeClient: (config: {
          client_id: string;
          scope: string;
          ux_mode: string;
          callback: (response: any) => void;
        }) => {
          requestCode: () => void;
        };
      };
    };
  };
}
