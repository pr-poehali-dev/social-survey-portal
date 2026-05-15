import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useYandexAuth } from "@/components/extensions/yandex-auth/useYandexAuth";

const AUTH_URL = "https://functions.poehali.dev/38579c8f-0969-4569-8dfe-d5b86b2ebd28";

const apiUrls = {
  authUrl: `${AUTH_URL}?action=auth-url`,
  callback: `${AUTH_URL}?action=callback`,
  refresh: `${AUTH_URL}?action=refresh`,
  logout: `${AUTH_URL}?action=logout`,
};

const YandexCallback = () => {
  const navigate = useNavigate();
  const auth = useYandexAuth({ apiUrls });
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    auth.handleCallback().then((success) => {
      navigate(success ? "/" : "/?auth_error=1", { replace: true });
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground">Выполняется вход...</p>
      </div>
    </div>
  );
};

export default YandexCallback;
