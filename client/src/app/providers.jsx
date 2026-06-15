"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import queryClient from "@/lib/queryClient";
import store from "@/lib/store";

const Providers = ({ children }) => {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                {children}
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            </QueryClientProvider>
        </Provider>
    );
};

export default Providers;
