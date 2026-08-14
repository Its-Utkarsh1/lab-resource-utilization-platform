import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter
} from "react-router-dom";

import {
  QueryClient,
  QueryClientProvider
} from "react-query";

import {
  Toaster
} from "react-hot-toast";

import App from "./App.jsx";

import {
  AuthProvider
} from "./context/AuthContext.jsx";

import "./styles/index.css";

const queryClient =
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1
      }
    }
  });

ReactDOM
  .createRoot(
    document.getElementById("root")
  )
  .render(

    <React.StrictMode>

      <QueryClientProvider
        client={queryClient}
      >

        <BrowserRouter>

          <AuthProvider>

            <App />

          </AuthProvider>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1e293b",
                color: "#fff"
              }
            }}
          />

        </BrowserRouter>

      </QueryClientProvider>

    </React.StrictMode>
  );