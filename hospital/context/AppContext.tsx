
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Booking, Hospital, INITIAL_BOOKINGS, DiagnosticService, SERVICES, HOSPITALS } from "@/data/mockData";

interface AppContextProps {
  selectedCompareIds: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  
  currentUser: { id?: string; name: string; email: string; phone: string; city: string; role?: string } | null;
  accessToken: string | null;
  loginUser: (email: string, name?: string, password?: string) => Promise<void>;
  logoutUser: () => void;
  
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id">) => Promise<string>;
  cancelBooking: (id: string) => Promise<void>;
  
  searchService: string;
  searchCity: string;
  setSearchService: (service: string) => void;
  setSearchCity: (city: string) => void;
  
  adminHospitals: Hospital[];
  updateAdminHospitalServicePrice: (hospitalId: string, serviceId: string, newPrice: number) => Promise<void>;

  hospitals: Hospital[];
  services: DiagnosticService[];
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Compare State
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<{ id?: string; name: string; email: string; phone: string; city: string; role?: string } | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Search State
  const [searchService, setSearchService] = useState<string>("mri");
  const [searchCity, setSearchCity] = useState<string>("Mumbai");

  // Dynamic Fullstack Lists
  const [hospitals, setHospitals] = useState<Hospital[]>(HOSPITALS);
  const [services, setServices] = useState<DiagnosticService[]>(SERVICES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  const hasRetriedLogin = React.useRef(false);

  // Load session from localStorage on mount and auto-login default user if empty
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("currentUser");
      const storedToken = localStorage.getItem("accessToken");
      if (storedUser && storedToken) {
        try {
          setCurrentUser(JSON.parse(storedUser));
          setAccessToken(storedToken);
        } catch (e) {
          console.error("Failed to parse stored user session:", e);
        }
      } 
    }
  }, []);

  // Fetch initial data from MongoDB via Express API
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log(`Connecting to backend at: ${API_URL}...`);
        
        // Fetch services
        const resServices = await fetch(`${API_URL}/api/services`);
        if (resServices.ok) {
          const data = await resServices.json();
          if (data && data.length > 0) {
            SERVICES.length = 0;
            SERVICES.push(...data);
            setServices([...SERVICES]);
          }
        }

        // Fetch hospitals
        const resHospitals = await fetch(`${API_URL}/api/hospitals`);
        if (resHospitals.ok) {
          const data = await resHospitals.json();
          if (data && data.length > 0) {
            HOSPITALS.length = 0;
            HOSPITALS.push(...data);
            setHospitals([...HOSPITALS]);
          }
        }

        // Fetch bookings (if authenticated)
        if (accessToken) {
          const headers: Record<string, string> = {
            "Authorization": `Bearer ${accessToken}`
          };
          const resBookings = await fetch(`${API_URL}/api/bookings`, { headers });
          if (resBookings.ok) {
            const data = await resBookings.json();
            if (data) setBookings(data);
          } else if (resBookings.status === 401 || resBookings.status === 403) {
            console.warn("Access token rejected by server (401/403). Retrying login once.");
            
            if (!hasRetriedLogin.current) {
              
            } else {
              // If we already retried and still fail, fall back to mock local data
              console.warn("Re-authentication failed. Falling back to local mock data.");
              setBookings(INITIAL_BOOKINGS);
            }
          }
        } else {
          setBookings(INITIAL_BOOKINGS);
        }
      } catch (err) {
        console.warn("Failed to fetch from backend. Falling back to local mock data.", err);
      }
    };
    loadData();
  }, [API_URL, accessToken]);

  const toggleCompare = (id: string) => {
    setSelectedCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 3) {
          alert("You can compare up to 3 hospitals at a time.");
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const clearCompare = () => setSelectedCompareIds([]);

  const loginUser = async (email: string, name?: string, password?: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          name: name || "User",
          password: password || "SecurePassword123" // Fallback default for existing users
        })
      });
      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        setCurrentUser(data.user);
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("currentUser", JSON.stringify(data.user));
        }
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      console.warn("Auth API failed, executing fallback mock login:", err);
      const fallbackUser = {
        name: name || "User",
        email: email,
        phone: "+91 99999 88888",
        city: searchCity,
        role: "Patient"
      };
      setCurrentUser(fallbackUser);
      setAccessToken("mock_token_abc123");
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", "mock_token_abc123");
        localStorage.setItem("currentUser", JSON.stringify(fallbackUser));
      }
    }
  };

  const logoutUser = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      console.warn("API logout error:", err);
    }
    setCurrentUser(null);
    setAccessToken(null);
    setBookings([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentUser");
    }
  };

  const addBooking = async (bookingData: Omit<Booking, "id">): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify(bookingData)
      });
      if (response.ok) {
        const newBooking = await response.json();
        setBookings((prev) => [newBooking, ...prev]);
        return newBooking.id;
      } else {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to save booking");
      }
    } catch (err: any) {
      console.warn("API addBooking failed. Executing fallback local booking creation:", err);
      if (err.message && err.message.includes("already booked")) {
        alert(err.message);
        throw err;
      }
      const bookingId = `MC-${Math.floor(1000 + Math.random() * 9000)}`;
      const newBooking: Booking = {
        ...bookingData,
        id: bookingId
      };
      setBookings((prev) => [newBooking, ...prev]);
      return bookingId;
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/bookings/${id}/cancel`, {
        method: "PUT",
        headers: {
          ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {})
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? data.booking : b))
        );
      } else {
        throw new Error("Failed to cancel booking");
      }
    } catch (err) {
      console.warn("API cancelBooking failed. Executing local fallback cancel:", err);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b))
      );
    }
  };

  const updateAdminHospitalServicePrice = async (hospitalId: string, serviceId: string, newPrice: number) => {
    try {
      const response = await fetch(`${API_URL}/api/hospitals/${hospitalId}/services/${serviceId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({ price: newPrice })
      });
      if (response.ok) {
        const data = await response.json();
        
        const idx = HOSPITALS.findIndex(h => h.id === hospitalId);
        if (idx !== -1) {
          HOSPITALS[idx] = data.hospital;
        }

        setHospitals([...HOSPITALS]);
      } else {
        throw new Error("Failed to update service price");
      }
    } catch (err) {
      console.warn("API update price failed. Executing local fallback update:", err);
      const idx = HOSPITALS.findIndex(h => h.id === hospitalId);
      if (idx !== -1) {
        const serviceObj = HOSPITALS[idx].services[serviceId];
        if (serviceObj) {
          HOSPITALS[idx].services[serviceId].price = newPrice;
        }
      }
      setHospitals([...HOSPITALS]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        selectedCompareIds,
        toggleCompare,
        clearCompare,
        currentUser,
        accessToken,
        loginUser,
        logoutUser,
        bookings,
        addBooking,
        cancelBooking,
        searchService,
        searchCity,
        setSearchService,
        setSearchCity,
        adminHospitals: hospitals,
        updateAdminHospitalServicePrice,
        hospitals,
        services
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
