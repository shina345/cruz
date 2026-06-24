"use client";

import { useState, useEffect, useRef } from "react";
import FadeInClient from "@/components/FadeInClient";
import { useServerGarments } from "@/hooks/useServerGarments";
import {
  womenCollection,
  menCollection,
  rtwCollection,
  knitwearCollection,
  denimCollection,
  outerwearRow1,
  outerwearRow3,
} from "@/constants/collections";

const outerwearCollection = [...outerwearRow1, ...outerwearRow3];

interface UploadedItem {
  id: string;
  title: string;
  img: string;
  look: string;
  category: string;
  mt?: string;
}

interface ClientInquiry {
  id: string;
  lookId: string;
  lookLabel: string;
  lookTitle: string;
  lookImg: string;
  clientName: string;
  clientEmail: string;
  clientSize: string;
  clientNotes: string;
  timestamp: string;
  status: "pending" | "contacted";
}

const ADMIN_PASSCODE = "cruz2026";

const DEFAULTS = {
  logoUrl: "/cruz_logo.png",
  heroVideoUrl: "https://player.vimeo.com/external/498425268.hd.mp4?s=d7e366ff42c1613ebbe6a894a7cb2eddbf8e353f&profile_id=175",
  heroImageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2000&auto=format&fit=crop",
  heroMediaType: "video",
  heroTitle: "The Milan Atelier",
  homeLook1Url: "https://images.unsplash.com/photo-1550614000-4b95d466f21c?q=80&w=1200&auto=format&fit=crop",
  homeLook2Url: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
  showroomVideoUrl: "https://player.vimeo.com/external/498425268.hd.mp4?s=d7e366ff42c1613ebbe6a894a7cb2eddbf8e353f&profile_id=175",
  showroomVideoSlideUrl: "https://player.vimeo.com/external/498425268.hd.mp4?s=d7e366ff42c1613ebbe6a894a7cb2eddbf8e353f&profile_id=175",
  showroomSlide1Url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop",
  showroomSlide3Url: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
  showroomSlide4Url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2500&auto=format&fit=crop",
  outerwearCoverUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop",
  womenCoverUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop",
  womenEditorialUrl: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=2000&auto=format&fit=crop",
  menCoverUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop",
  knitwearCoverUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=2000&auto=format&fit=crop",
  denimCoverUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=2000&auto=format&fit=crop",
  homeQuoteUrl: "/quote.jpg",
  homeCampaignUrl: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=2000&auto=format&fit=crop",
  tailoringBrandImg: "/cruz_tank_top.jpg",
  searchLook1Url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop",
  searchLook2Url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<"garments" | "silhouettes" | "layout" | "inquiries">("garments");

  // Form states for custom silhouettes
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("men");
  const [imgSourceType, setImgSourceType] = useState<"preset" | "url">("preset");
  const [presetImg, setPresetImg] = useState("/cruz_beanie.jpg");
  const [customImgUrl, setCustomImgUrl] = useState("");
  const [look, setLook] = useState("");
  const [mtOffset, setMtOffset] = useState("");
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // ── New Garment Manager (server-backed) ──
  const { garments: serverGarments, loading: gLoading, refresh: refreshGarments } = useServerGarments();
  const [gTitle, setGTitle] = useState("");
  const [gCategory, setGCategory] = useState("men");
  const [gLook, setGLook] = useState("");
  const [gFile, setGFile] = useState<File | null>(null);
  const [gImgUrl, setGImgUrl] = useState("");
  const [gUploading, setGUploading] = useState(false);
  const [gFilter, setGFilter] = useState("all");
  const gFileRef = useRef<HTMLInputElement>(null);

  // Stock Control states
  const [selectedStockCategory, setSelectedStockCategory] = useState("men");
  const [outOfStockIds, setOutOfStockIds] = useState<string[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // Client Fitting Inquiries state
  const [inquiries, setInquiries] = useState<ClientInquiry[]>([]);

  // Form states for website layout media configuration
  const [logoUrl, setLogoUrl] = useState(DEFAULTS.logoUrl);
  const [heroVideoUrl, setHeroVideoUrl] = useState(DEFAULTS.heroVideoUrl);
  const [heroImageUrl, setHeroImageUrl] = useState(DEFAULTS.heroImageUrl);
  const [heroMediaType, setHeroMediaType] = useState(DEFAULTS.heroMediaType);
  const [heroTitle, setHeroTitle] = useState(DEFAULTS.heroTitle);
  const [homeLook1Url, setHomeLook1Url] = useState(DEFAULTS.homeLook1Url);
  const [homeLook2Url, setHomeLook2Url] = useState(DEFAULTS.homeLook2Url);
  const [showroomVideoUrl, setShowroomVideoUrl] = useState(DEFAULTS.showroomVideoUrl);
  const [showroomVideoSlideUrl, setShowroomVideoSlideUrl] = useState(DEFAULTS.showroomVideoSlideUrl);
  const [showroomSlide1Url, setShowroomSlide1Url] = useState(DEFAULTS.showroomSlide1Url);
  const [showroomSlide3Url, setShowroomSlide3Url] = useState(DEFAULTS.showroomSlide3Url);
  const [showroomSlide4Url, setShowroomSlide4Url] = useState(DEFAULTS.showroomSlide4Url);
  
  const [outerwearCoverUrl, setOuterwearCoverUrl] = useState(DEFAULTS.outerwearCoverUrl);
  const [womenCoverUrl, setWomenCoverUrl] = useState(DEFAULTS.womenCoverUrl);
  const [womenEditorialUrl, setWomenEditorialUrl] = useState(DEFAULTS.womenEditorialUrl);
  const [menCoverUrl, setMenCoverUrl] = useState(DEFAULTS.menCoverUrl);
  const [knitwearCoverUrl, setKnitwearCoverUrl] = useState(DEFAULTS.knitwearCoverUrl);
  const [denimCoverUrl, setDenimCoverUrl] = useState(DEFAULTS.denimCoverUrl);

  const [homeQuoteUrl, setHomeQuoteUrl] = useState(DEFAULTS.homeQuoteUrl);
  const [homeCampaignUrl, setHomeCampaignUrl] = useState(DEFAULTS.homeCampaignUrl);
  const [tailoringBrandImg, setTailoringBrandImg] = useState(DEFAULTS.tailoringBrandImg);
  const [searchLook1Url, setSearchLook1Url] = useState(DEFAULTS.searchLook1Url);
  const [searchLook2Url, setSearchLook2Url] = useState(DEFAULTS.searchLook2Url);

  const presetImages = [
    { src: "/cruz_beanie.jpg", label: "Cruz Beanie (Black)" },
    { src: "/cruz_tank_top.jpg", label: "Cruz Logo Tank Top (White)" },
    { src: "/heavenly_polo_white.jpg", label: "Heavenly XS Polo (White)" },
    { src: "/heritage_bodysuit_white.jpg", label: "Heritage Bodysuit (White)" },
    { src: "/heavenly_polo_black.jpg", label: "Heritage Bodysuit (Black)" },
    { src: "/gothic_shorts.jpg", label: "Cruz Gothic Shorts (Black)" },
    { src: "/ribbed_bodysuit.jpg", label: "Heritage Bodysuit (Black)" },
    { src: "/gothic_jorts.jpg", label: "Tribal Cross Jorts" },
  ];

  // Load configuration on mount or when auth state updates
  useEffect(() => {
    if (sessionStorage.getItem("cruz_admin_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  const loadConfigStates = () => {
    const getValue = (key: string, fb: string) => localStorage.getItem(`cruz_config_${key}`) || fb;
    setLogoUrl(getValue("logoUrl", DEFAULTS.logoUrl));
    setHeroVideoUrl(getValue("heroVideoUrl", DEFAULTS.heroVideoUrl));
    setHeroImageUrl(getValue("heroImageUrl", DEFAULTS.heroImageUrl));
    setHeroMediaType(getValue("heroMediaType", DEFAULTS.heroMediaType));
    setHeroTitle(getValue("heroTitle", DEFAULTS.heroTitle));
    setHomeLook1Url(getValue("homeLook1Url", DEFAULTS.homeLook1Url));
    setHomeLook2Url(getValue("homeLook2Url", DEFAULTS.homeLook2Url));
    setShowroomVideoUrl(getValue("showroomVideoUrl", DEFAULTS.showroomVideoUrl));
    setShowroomVideoSlideUrl(getValue("showroomVideoSlideUrl", DEFAULTS.showroomVideoSlideUrl));
    setShowroomSlide1Url(getValue("showroomSlide1Url", DEFAULTS.showroomSlide1Url));
    setShowroomSlide3Url(getValue("showroomSlide3Url", DEFAULTS.showroomSlide3Url));
    setShowroomSlide4Url(getValue("showroomSlide4Url", DEFAULTS.showroomSlide4Url));
    
    setOuterwearCoverUrl(getValue("outerwearCoverUrl", DEFAULTS.outerwearCoverUrl));
    setWomenCoverUrl(getValue("womenCoverUrl", DEFAULTS.womenCoverUrl));
    setWomenEditorialUrl(getValue("womenEditorialUrl", DEFAULTS.womenEditorialUrl));
    setMenCoverUrl(getValue("menCoverUrl", DEFAULTS.menCoverUrl));
    setKnitwearCoverUrl(getValue("knitwearCoverUrl", DEFAULTS.knitwearCoverUrl));
    setDenimCoverUrl(getValue("denimCoverUrl", DEFAULTS.denimCoverUrl));

    setHomeQuoteUrl(getValue("homeQuoteUrl", DEFAULTS.homeQuoteUrl));
    setHomeCampaignUrl(getValue("homeCampaignUrl", DEFAULTS.homeCampaignUrl));
    setTailoringBrandImg(getValue("tailoringBrandImg", DEFAULTS.tailoringBrandImg));
    setSearchLook1Url(getValue("searchLook1Url", DEFAULTS.searchLook1Url));
    setSearchLook2Url(getValue("searchLook2Url", DEFAULTS.searchLook2Url));
  };

  useEffect(() => {
    if (!authenticated) return;
    loadConfigStates();
    
    // Load custom uploaded items
    const stored = localStorage.getItem("cruz_uploaded_items");
    if (stored) {
      try {
        setUploadedItems(JSON.parse(stored));
      } catch (err) {
        console.error(err);
      }
    }

    // Load out-of-stock item IDs
    const oos = localStorage.getItem("cruz_out_of_stock_items");
    if (oos) {
      try {
        setOutOfStockIds(JSON.parse(oos));
      } catch (err) {
        console.error(err);
      }
    }

    // Load deleted item IDs
    const deleted = localStorage.getItem("cruz_deleted_items");
    if (deleted) {
      try {
        setDeletedIds(JSON.parse(deleted));
      } catch (err) {
        console.error(err);
      }
    }

    // Load client fitting inquiries
    const storedInquiries = localStorage.getItem("cruz_showroom_inquiries");
    if (storedInquiries) {
      try {
        setInquiries(JSON.parse(storedInquiries));
      } catch (err) {
        console.error(err);
      }
    }
  }, [authenticated]);

  // Sync inquiries on event
  useEffect(() => {
    if (!authenticated) return;
    const handleInquiriesSync = () => {
      const storedInquiries = localStorage.getItem("cruz_showroom_inquiries");
      if (storedInquiries) {
        try {
          setInquiries(JSON.parse(storedInquiries));
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener("cruz_inquiries_updated", handleInquiriesSync);
    return () => window.removeEventListener("cruz_inquiries_updated", handleInquiriesSync);
  }, [authenticated]);

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      sessionStorage.setItem("cruz_admin_auth", "true");
      setAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setPasscode("");
      setTimeout(() => setAuthError(false), 600);
    }
  };

  // Add Silhouette
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showNotification("error", "Please specify a title.");
      return;
    }

    const img = imgSourceType === "preset" ? presetImg : customImgUrl.trim();
    if (!img) {
      showNotification("error", "Please specify or select an image.");
      return;
    }

    const lookLabel = look.trim() || `Look ${Date.now().toString().slice(-2)}`;

    const newItem: UploadedItem = {
      id: `uploaded-${Date.now()}`,
      title: title.trim(),
      img,
      look: lookLabel,
      category,
      mt: mtOffset,
    };

    const updated = [newItem, ...uploadedItems];
    localStorage.setItem("cruz_uploaded_items", JSON.stringify(updated));
    setUploadedItems(updated);

    // Reset Form
    setTitle("");
    setLook("");
    setCustomImgUrl("");
    setMtOffset("");

    window.dispatchEvent(new Event("cruz_collections_updated"));
    showNotification("success", `"${newItem.title}" added to Archive under ${category.toUpperCase()}.`);
  };

  const handleDelete = async (id: string) => {
    const target = uploadedItems.find((item) => item.id === id);
    if (target && target.img?.startsWith("/uploads/")) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: target.img }),
        });
      } catch (err) {
        console.error("Failed to delete file from server", err);
      }
    }

    const updated = uploadedItems.filter((item) => item.id !== id);
    localStorage.setItem("cruz_uploaded_items", JSON.stringify(updated));
    setUploadedItems(updated);
    
    // Also remove from OOS list if it was there
    if (outOfStockIds.includes(id)) {
      const updatedOos = outOfStockIds.filter((itemOosId) => itemOosId !== id);
      setOutOfStockIds(updatedOos);
      localStorage.setItem("cruz_out_of_stock_items", JSON.stringify(updatedOos));
    }

    window.dispatchEvent(new Event("cruz_collections_updated"));
    showNotification("success", "Item removed from archive.");
  };

  // Server Upload Handler — saves to /public/uploads/ so ALL users see it
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, configKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    showNotification("success", "Uploading…");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        // Fallback to client-side Base64 storage on server write failure (like Vercel)
        if (file.size > 3 * 1024 * 1024) {
          showNotification("error", "Local fallback size limit exceeded (max 3MB).");
          return;
        }
        const base64Url = await fileToBase64(file);
        localStorage.setItem(`cruz_config_${configKey}`, base64Url);
        window.dispatchEvent(new Event("storage_cruz_config"));
        updateStateField(configKey, base64Url);
        showNotification("success", "Layout updated (saved in browser storage; server is read-only).");
        return;
      }

      const { url } = await res.json();
      // Persist the public URL so useSiteConfig picks it up everywhere
      localStorage.setItem(`cruz_config_${configKey}`, url);
      window.dispatchEvent(new Event("storage_cruz_config"));
      updateStateField(configKey, url);
      showNotification("success", "Image uploaded — now visible to all visitors.");
    } catch (err) {
      console.error(err);
      // Fallback on network error
      try {
        if (file.size > 3 * 1024 * 1024) {
          showNotification("error", "Local fallback size limit exceeded (max 3MB).");
          return;
        }
        const base64Url = await fileToBase64(file);
        localStorage.setItem(`cruz_config_${configKey}`, base64Url);
        window.dispatchEvent(new Event("storage_cruz_config"));
        updateStateField(configKey, base64Url);
        showNotification("success", "Layout updated (saved in browser storage).");
      } catch {
        showNotification("error", "Network error. Upload failed.");
      }
    }

    // Reset the file input so the same file can be re-selected if needed
    e.target.value = "";
  };

  // Save specific text config values
  const saveConfig = (key: string, val: string) => {
    localStorage.setItem(`cruz_config_${key}`, val);
    window.dispatchEvent(new Event("storage_cruz_config"));
    showNotification("success", "Custom link setting saved.");
  };

  // Clear specific configuration override
  const handleRemoveSingleConfig = async (key: string) => {
    const val = localStorage.getItem(`cruz_config_${key}`);
    if (val && val.startsWith("/uploads/")) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: val }),
        });
      } catch (err) {
        console.error("Failed to delete file from server", err);
      }
    }

    localStorage.removeItem(`cruz_config_${key}`);
    window.dispatchEvent(new Event("storage_cruz_config"));
    loadConfigStates();
    showNotification("success", `Removed override for ${key.toUpperCase()}. Reverted to fallback design preset.`);
  };

  // Clear all overrides and restore default presets
  const handleRestoreDefaults = async () => {
    for (const k of Object.keys(DEFAULTS)) {
      const val = localStorage.getItem(`cruz_config_${k}`);
      if (val && val.startsWith("/uploads/")) {
        try {
          await fetch("/api/upload", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: val }),
          });
        } catch (err) {
          console.error("Failed to delete file from server", err);
        }
      }
      localStorage.removeItem(`cruz_config_${k}`);
    }
    window.dispatchEvent(new Event("storage_cruz_config"));
    loadConfigStates();
    showNotification("success", "Original designer layouts and presets restored.");
  };

  // Toggle stock availability status (Sold Out vs Available)
  const toggleStockStatus = (itemId: string) => {
    let updatedOosList = [...outOfStockIds];
    if (updatedOosList.includes(itemId)) {
      updatedOosList = updatedOosList.filter((id) => id !== itemId);
      showNotification("success", "Item marked as Available.");
    } else {
      updatedOosList.push(itemId);
      showNotification("success", "Item marked as Sold Out (Out of Stock).");
    }
    setOutOfStockIds(updatedOosList);
    localStorage.setItem("cruz_out_of_stock_items", JSON.stringify(updatedOosList));
    window.dispatchEvent(new Event("cruz_collections_updated"));
  };

  // Toggle delete/removed from catalog status
  const toggleDeleteStatus = (itemId: string) => {
    let updatedDeletedList = [...deletedIds];
    if (updatedDeletedList.includes(itemId)) {
      updatedDeletedList = updatedDeletedList.filter((id) => id !== itemId);
      showNotification("success", "Item restored to catalog.");
    } else {
      updatedDeletedList.push(itemId);
      showNotification("success", "Item removed from catalog.");
    }
    setDeletedIds(updatedDeletedList);
    localStorage.setItem("cruz_deleted_items", JSON.stringify(updatedDeletedList));
    window.dispatchEvent(new Event("cruz_collections_updated"));
  };

  // Permanently delete a custom silhouette item from the archive
  const removeImage = async (itemId: string) => {
    const target = uploadedItems.find((item) => item.id === itemId);
    if (target && target.img?.startsWith("/uploads/")) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: target.img }),
        });
      } catch (err) {
        console.error("Failed to delete file from server", err);
      }
    }

    const updated = uploadedItems.filter((item) => item.id !== itemId);
    setUploadedItems(updated);
    localStorage.setItem("cruz_uploaded_items", JSON.stringify(updated));

    // Also clean up from OOS list if present
    if (outOfStockIds.includes(itemId)) {
      const updatedOos = outOfStockIds.filter((id) => id !== itemId);
      setOutOfStockIds(updatedOos);
      localStorage.setItem("cruz_out_of_stock_items", JSON.stringify(updatedOos));
    }

    // Also clean up from deleted list if present
    if (deletedIds.includes(itemId)) {
      const updatedDeleted = deletedIds.filter((id) => id !== itemId);
      setDeletedIds(updatedDeleted);
      localStorage.setItem("cruz_deleted_items", JSON.stringify(updatedDeleted));
    }

    window.dispatchEvent(new Event("cruz_collections_updated"));
    showNotification("success", "Item permanently deleted from archive.");
  };

  // Toggle inquiry pending vs contacted
  const toggleInquiryStatus = (id: string) => {
    const updated = inquiries.map((inq) => {
      if (inq.id === id) {
        const newStatus = inq.status === "pending" ? "contacted" : "pending";
        showNotification("success", `Fitting inquiry status changed to ${newStatus.toUpperCase()}.`);
        return { ...inq, status: newStatus as "pending" | "contacted" };
      }
      return inq;
    });
    setInquiries(updated);
    localStorage.setItem("cruz_showroom_inquiries", JSON.stringify(updated));
  };

  // Delete/Archive fitting request
  const handleDeleteInquiry = (id: string) => {
    const updated = inquiries.filter((inq) => inq.id !== id);
    setInquiries(updated);
    localStorage.setItem("cruz_showroom_inquiries", JSON.stringify(updated));
    showNotification("success", "Inquiry archived.");
  };

  const clearAllInquiries = () => {
    setInquiries([]);
    localStorage.setItem("cruz_showroom_inquiries", JSON.stringify([]));
    showNotification("success", "All showroom inquiries cleared.");
  };

  // Get both static and custom items for category filter
  const getCategoryItems = (cat: string) => {
    let staticList = menCollection;
    if (cat === "women") staticList = womenCollection;
    else if (cat === "rtw") staticList = rtwCollection;
    else if (cat === "knitwear") staticList = knitwearCollection;
    else if (cat === "denim") staticList = denimCollection;
    else if (cat === "outerwear") staticList = outerwearCollection;

    const filtered = uploadedItems
      .filter((item) => item.category === cat)
      .map((item) => ({
        id: item.id,
        title: item.title,
        img: item.img,
        look: item.look,
        mt: item.mt || "",
      }));

    const merged = [...staticList];
    const appended: typeof filtered = [];

    filtered.forEach((customItem) => {
      const customLookNormalized = customItem.look.trim().toLowerCase();
      const matchIndex = merged.findIndex(
        (sItem) => sItem.look.trim().toLowerCase() === customLookNormalized
      );
      if (matchIndex !== -1) {
        merged[matchIndex] = {
          ...merged[matchIndex],
          title: customItem.title,
          img: customItem.img,
          mt: customItem.mt || merged[matchIndex].mt,
        };
      } else {
        appended.push(customItem);
      }
    });

    return [...merged, ...appended];
  };

  const updateStateField = (key: string, val: string) => {
    switch (key) {
      case "logoUrl": setLogoUrl(val); break;
      case "heroVideoUrl": setHeroVideoUrl(val); break;
      case "heroImageUrl": setHeroImageUrl(val); break;
      case "heroMediaType": setHeroMediaType(val); break;
      case "heroTitle": setHeroTitle(val); break;
      case "homeLook1Url": setHomeLook1Url(val); break;
      case "homeLook2Url": setHomeLook2Url(val); break;
      case "showroomVideoUrl": setShowroomVideoUrl(val); break;
      case "showroomVideoSlideUrl": setShowroomVideoSlideUrl(val); break;
      case "showroomSlide1Url": setShowroomSlide1Url(val); break;
      case "showroomSlide3Url": setShowroomSlide3Url(val); break;
      case "showroomSlide4Url": setShowroomSlide4Url(val); break;
      case "outerwearCoverUrl": setOuterwearCoverUrl(val); break;
      case "womenCoverUrl": setWomenCoverUrl(val); break;
      case "womenEditorialUrl": setWomenEditorialUrl(val); break;
      case "menCoverUrl": setMenCoverUrl(val); break;
      case "knitwearCoverUrl": setKnitwearCoverUrl(val); break;
      case "denimCoverUrl": setDenimCoverUrl(val); break;
      case "homeQuoteUrl": setHomeQuoteUrl(val); break;
      case "homeCampaignUrl": setHomeCampaignUrl(val); break;
      case "tailoringBrandImg": setTailoringBrandImg(val); break;
      case "searchLook1Url": setSearchLook1Url(val); break;
      case "searchLook2Url": setSearchLook2Url(val); break;
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Reusable render helper for customizable layout settings.
  // hasCustom is derived from the reactive `currentValue` state — not a cold
  // localStorage.getItem — so the Remove button appears immediately after upload.
  const renderMediaCard = (
    label: string,
    configKey: keyof typeof DEFAULTS,
    currentValue: string,
    isImage: boolean = true
  ) => {
    const hasCustom = currentValue !== DEFAULTS[configKey];
    return (
      <div key={configKey} className="group border border-cruzBorder/40 bg-white/40 p-5 transition-all duration-300 hover:border-cruzBlack/30 relative flex flex-col justify-between">
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cruzBlack/20 group-hover:border-cruzBlack/50"></div>
        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-cruzBlack/20 group-hover:border-cruzBlack/50"></div>
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-cruzBlack/20 group-hover:border-cruzBlack/50"></div>
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cruzBlack/20 group-hover:border-cruzBlack/50"></div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-gray-500">{label}</span>
            <span className={`text-[7px] font-mono uppercase px-2 py-0.5 border ${
              hasCustom ? "border-cruzGold/30 text-cruzGold bg-cruzGold/5" : "border-gray-200 text-gray-400 bg-gray-50"
            }`}>
              {hasCustom ? "Custom Override" : "Default Preset"}
            </span>
          </div>

          {isImage ? (
            <div className="aspect-[16/9] w-full bg-cruzGrey border border-cruzBorder/30 mb-4 overflow-hidden relative flex items-center justify-center p-1">
              {currentValue ? (
                <img src={currentValue} alt={label} className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-[9px] font-mono text-gray-300 uppercase tracking-widest">No Image Set</span>
              )}
            </div>
          ) : (
            <div className="aspect-[16/9] w-full bg-cruzGrey border border-cruzBorder/30 mb-4 overflow-hidden relative flex flex-col items-center justify-center p-4">
              <span className="text-[12px] text-cruzBlack/40 font-mono select-none">▶ VIDEO STREAM</span>
              <span className="text-[7px] text-gray-400 font-mono truncate max-w-full mt-2 select-none">{currentValue}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <label className="flex-1 cursor-pointer bg-cruzBlack hover:bg-cruzBlack/90 text-cruzBg text-[8px] tracking-widest font-mono uppercase py-2 text-center transition-all">
              Upload File
              <input
                type="file"
                accept={isImage ? "image/*" : "video/*"}
                className="hidden"
                onChange={(e) => handleFileUpload(e, configKey)}
              />
            </label>

            {hasCustom && (
              <button
                type="button"
                onClick={() => handleRemoveSingleConfig(configKey)}
                className="border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-[8px] tracking-widest font-mono uppercase px-3 py-2 transition-all"
              >
                Remove
              </button>
            )}
          </div>

          <input
            type="text"
            value={currentValue}
            onChange={(e) => {
              updateStateField(configKey, e.target.value);
              saveConfig(configKey, e.target.value);
            }}
            className="w-full bg-cruzBg/30 border border-cruzBorder/60 px-2 py-1.5 text-[8.5px] font-mono text-gray-600 focus:outline-none focus:border-cruzBlack/40 focus:bg-white transition-colors"
            placeholder="Paste direct HTTPS link..."
          />
        </div>
      </div>
    );
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-cruzBlack text-cruzBg flex flex-col items-center justify-center relative overflow-hidden">
        <div className="film-grain opacity-50" />

        {/* Corner HUD brackets */}
        <div className="absolute top-8 left-8 w-8 h-8 border-t border-l border-cruzBg/10" />
        <div className="absolute top-8 right-8 w-8 h-8 border-t border-r border-cruzBg/10" />
        <div className="absolute bottom-8 left-8 w-8 h-8 border-b border-l border-cruzBg/10" />
        <div className="absolute bottom-8 right-8 w-8 h-8 border-b border-r border-cruzBg/10" />

        <div className="w-full max-w-sm px-8 text-center">
          <img src="/cruz_logo.png" alt="Cruz" className="h-12 w-auto object-contain mx-auto mb-16 opacity-80 invert" />

          <p className="text-[8px] tracking-[0.4em] uppercase text-cruzBg/40 font-mono mb-2">Restricted Access</p>
          <h1 className="text-2xl font-serif font-light tracking-widest mb-12">Studio Archive</h1>

          <form onSubmit={handlePasscodeSubmit} className="space-y-8">
            <div className={`border-b transition-all duration-300 ${authError ? "border-red-500" : "border-cruzBg/20"}`}>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter access code"
                autoFocus
                className={`w-full bg-transparent text-cruzBg text-center text-[11px] tracking-[0.4em] uppercase font-mono py-3 outline-none placeholder-cruzBg/20 transition-all duration-300 ${
                  authError ? "animate-pulse text-red-400" : ""
                }`}
              />
            </div>

            {authError && (
              <p className="text-[8px] tracking-[0.3em] uppercase text-red-400/80 font-mono">Access Denied</p>
            )}

            <button
              type="submit"
              className="w-full border border-cruzBg/20 hover:border-cruzBg/60 py-3 text-[9px] uppercase tracking-[0.4em] font-mono transition-all duration-300 hover:bg-cruzBg/5"
            >
              Authenticate
            </button>
          </form>

          <p className="text-[8px] tracking-[0.2em] uppercase text-cruzBg/20 font-mono mt-16">
            Cruz Creative Studio &bull; Private Access
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cruzBg text-cruzBlack pt-24 pb-32 relative">
      <FadeInClient />

      <section className="container mx-auto px-6 max-w-6xl">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-cruzBorder pb-6 mb-8">
          <div>
            <span className="text-[9px] tracking-[0.35em] text-cruzGold uppercase font-semibold">Workspace Controls</span>
            <h1 className="text-4xl md:text-5xl font-serif font-light tracking-wide mt-2">Atelier Studio Control</h1>
          </div>
          
          {/* Segmented Tab Controls */}
          <div className="flex gap-1 mt-6 md:mt-0 bg-cruzGrey p-1 border border-cruzBorder rounded-md overflow-x-auto">
            <button
              onClick={() => setActiveTab("garments")}
              className={`px-4 py-2 text-[9px] font-mono uppercase tracking-widest transition-all rounded whitespace-nowrap ${
                activeTab === "garments" ? "bg-cruzBlack text-cruzBg shadow" : "text-gray-400 hover:text-cruzBlack"
              }`}
            >
              Garment Manager
            </button>
            <button
              onClick={() => setActiveTab("silhouettes")}
              className={`px-4 py-2 text-[9px] font-mono uppercase tracking-widest transition-all rounded whitespace-nowrap ${
                activeTab === "silhouettes" ? "bg-cruzBlack text-cruzBg shadow" : "text-gray-400 hover:text-cruzBlack"
              }`}
            >
              Silhouettes &amp; Stock
            </button>
            <button
              onClick={() => setActiveTab("layout")}
              className={`px-4 py-2 text-[9px] font-mono uppercase tracking-widest transition-all rounded whitespace-nowrap ${
                activeTab === "layout" ? "bg-cruzBlack text-cruzBg shadow" : "text-gray-400 hover:text-cruzBlack"
              }`}
            >
              Layout &amp; Media
            </button>
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`px-4 py-2 text-[9px] font-mono uppercase tracking-widest transition-all rounded relative whitespace-nowrap ${
                activeTab === "inquiries" ? "bg-cruzBlack text-cruzBg shadow" : "text-gray-400 hover:text-cruzBlack"
              }`}
            >
              Client Inquiries
              {inquiries.filter(i => i.status === "pending").length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[7px] font-mono w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {inquiries.filter(i => i.status === "pending").length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Floating Notification */}
        {notification && (
          <div
            className={`fixed bottom-10 right-10 z-50 p-6 backdrop-blur-md shadow-2xl border transition-all duration-500 translate-y-0 ${
              notification.type === "success"
                ? "bg-cruzBlack text-cruzBg border-cruzBlack"
                : "bg-red-950/90 text-red-200 border-red-800"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`w-2 h-2 rounded-full ${notification.type === "success" ? "bg-cruzGold animate-pulse" : "bg-red-500"}`}></span>
              <p className="text-[10px] tracking-[0.2em] uppercase font-mono">{notification.message}</p>
            </div>
          </div>
        )}

        {/* TAB 0: GARMENT MANAGER (server-backed) */}
        {activeTab === "garments" && (
          <div className="fade-in-up space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

              {/* Upload Form */}
              <div className="lg:col-span-5">
                <div className="bg-white/45 backdrop-blur-sm border border-cruzBorder p-8 relative">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cruzBlack/20" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cruzBlack/20" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cruzBlack/20" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cruzBlack/20" />

                  <h2 className="text-xl font-serif tracking-wide border-b border-cruzBorder/50 pb-4 mb-8">Add Garment to Archive</h2>

                  <form
                    className="space-y-6"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!gTitle.trim()) { showNotification("error", "Title is required."); return; }
                      if (!gFile && !gImgUrl.trim()) { showNotification("error", "Please upload a file or paste an image URL."); return; }
                      setGUploading(true);
                      try {
                        const fd = new FormData();
                        fd.append("title", gTitle.trim());
                        fd.append("category", gCategory);
                        fd.append("look", gLook.trim());
                        if (gFile) fd.append("file", gFile);
                        if (!gFile && gImgUrl.trim()) fd.append("imgUrl", gImgUrl.trim());
                        const res = await fetch("/api/garments", { method: "POST", body: fd });
                        if (!res.ok) {
                          // Try local storage fallback (e.g., Vercel read-only filesystem)
                          if (gFile && gFile.size > 3 * 1024 * 1024) {
                            showNotification("error", "File too large for local fallback (max 3MB).");
                            return;
                          }
                          const img = gFile ? await fileToBase64(gFile) : gImgUrl.trim();
                          const lookLabel = gLook.trim() || `Look ${Date.now().toString().slice(-2)}`;
                          const newItem: UploadedItem = {
                            id: `uploaded-${Date.now()}`,
                            title: gTitle.trim(),
                            img,
                            look: lookLabel,
                            category: gCategory,
                            mt: "",
                          };
                          const updated = [newItem, ...uploadedItems];
                          localStorage.setItem("cruz_uploaded_items", JSON.stringify(updated));
                          setUploadedItems(updated);
                          setGTitle(""); setGLook(""); setGFile(null); setGImgUrl("");
                          if (gFileRef.current) gFileRef.current.value = "";
                          window.dispatchEvent(new Event("cruz_collections_updated"));
                          showNotification("success", "Garment saved in browser storage (Server-side storage read-only on Vercel).");
                        } else {
                          setGTitle(""); setGLook(""); setGFile(null); setGImgUrl("");
                          if (gFileRef.current) gFileRef.current.value = "";
                          refreshGarments();
                          showNotification("success", `Garment added to archive — visible to all visitors.`);
                        }
                      } catch {
                        // Fallback on network/CORS error
                        try {
                          if (gFile && gFile.size > 3 * 1024 * 1024) {
                            showNotification("error", "File too large for local fallback (max 3MB).");
                            return;
                          }
                          const img = gFile ? await fileToBase64(gFile) : gImgUrl.trim();
                          const lookLabel = gLook.trim() || `Look ${Date.now().toString().slice(-2)}`;
                          const newItem: UploadedItem = {
                            id: `uploaded-${Date.now()}`,
                            title: gTitle.trim(),
                            img,
                            look: lookLabel,
                            category: gCategory,
                            mt: "",
                          };
                          const updated = [newItem, ...uploadedItems];
                          localStorage.setItem("cruz_uploaded_items", JSON.stringify(updated));
                          setUploadedItems(updated);
                          setGTitle(""); setGLook(""); setGFile(null); setGImgUrl("");
                          if (gFileRef.current) gFileRef.current.value = "";
                          window.dispatchEvent(new Event("cruz_collections_updated"));
                          showNotification("success", "Garment saved in browser storage (Saved locally).");
                        } catch {
                          showNotification("error", "Network error. Upload failed.");
                        }
                      } finally {
                        setGUploading(false);
                      }
                    }}
                  >
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.25em] text-gray-500 font-mono">Garment Name *</label>
                      <input
                        type="text" value={gTitle}
                        onChange={(e) => setGTitle(e.target.value)}
                        placeholder="e.g. Cruz Wool Overcoat"
                        className="w-full bg-cruzBg/50 border border-cruzBorder px-4 py-3 text-[11px] uppercase tracking-widest focus:outline-none focus:border-cruzBlack/60 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.25em] text-gray-500 font-mono">Category *</label>
                        <select
                          value={gCategory} onChange={(e) => setGCategory(e.target.value)}
                          className="w-full bg-cruzBg/50 border border-cruzBorder px-3 py-3 text-[11px] uppercase tracking-widest focus:outline-none focus:border-cruzBlack/60 transition-colors appearance-none cursor-pointer"
                        >
                          <option value="men">Men</option>
                          <option value="women">Women</option>
                          <option value="rtw">Ready-to-Wear</option>
                          <option value="knitwear">Knitwear</option>
                          <option value="denim">Denim</option>
                          <option value="outerwear">Outerwear</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.25em] text-gray-500 font-mono">Look Label</label>
                        <input
                          type="text" value={gLook}
                          onChange={(e) => setGLook(e.target.value)}
                          placeholder="e.g. Look 01"
                          className="w-full bg-cruzBg/50 border border-cruzBorder px-4 py-3 text-[11px] uppercase tracking-widest focus:outline-none focus:border-cruzBlack/60 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 border-t border-cruzBorder/40 pt-5">
                      <label className="text-[9px] uppercase tracking-[0.25em] text-gray-500 font-mono">Garment Photo *</label>
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-cruzBorder/60 hover:border-cruzBlack/30 p-6 cursor-pointer transition-colors group">
                        {gFile ? (
                          <div className="text-center">
                            <img
                              src={URL.createObjectURL(gFile)}
                              className="h-32 w-auto object-contain mx-auto mb-2"
                              alt="preview"
                            />
                            <p className="text-[9px] font-mono text-cruzBlack/60 truncate max-w-[200px]">{gFile.name}</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400">Click to upload</p>
                            <p className="text-[8px] text-gray-300 mt-1">JPG, PNG, WebP up to 10MB</p>
                          </div>
                        )}
                        <input
                          ref={gFileRef} type="file" accept="image/*" className="hidden"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) { setGFile(f); setGImgUrl(""); } }}
                        />
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-cruzBorder/40" />
                        <span className="text-[8px] font-mono uppercase text-gray-400">or paste URL</span>
                        <div className="flex-1 h-px bg-cruzBorder/40" />
                      </div>
                      <input
                        type="url" value={gImgUrl}
                        onChange={(e) => { setGImgUrl(e.target.value); if (e.target.value) { setGFile(null); if (gFileRef.current) gFileRef.current.value = ""; } }}
                        placeholder="https://..."
                        className="w-full bg-cruzBg/50 border border-cruzBorder px-4 py-2.5 text-[11px] font-mono focus:outline-none focus:border-cruzBlack/60 transition-colors"
                      />
                    </div>

                    <button
                      type="submit" disabled={gUploading}
                      className="w-full bg-cruzBlack hover:bg-cruzBlack/90 disabled:opacity-50 text-cruzBg py-4 text-[10px] uppercase tracking-[0.3em] font-medium transition-colors border border-cruzBlack relative overflow-hidden group"
                    >
                      <span className="relative z-10">{gUploading ? "Publishing…" : "Publish to Archive"}</span>
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Garment List */}
              <div className="lg:col-span-7">
                <div className="bg-white/45 backdrop-blur-sm border border-cruzBorder p-8 relative min-h-[500px]">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cruzBlack/20" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cruzBlack/20" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cruzBlack/20" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cruzBlack/20" />

                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cruzBorder/50 pb-4 mb-6">
                    <h2 className="text-xl font-serif tracking-wide">Live Archive
                      <span className="text-[9px] font-mono text-cruzGold ml-3 align-middle">{serverGarments.length} garment{serverGarments.length !== 1 ? "s" : ""}</span>
                    </h2>
                    <div className="flex gap-2">
                      {["all","men","women","rtw","knitwear","denim","outerwear"].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setGFilter(cat)}
                          className={`text-[8px] font-mono uppercase tracking-widest px-2.5 py-1 border transition-all ${
                            gFilter === cat ? "bg-cruzBlack text-cruzBg border-cruzBlack" : "border-cruzBorder/60 text-gray-400 hover:border-cruzBlack/40"
                          }`}
                        >{cat === "all" ? "All" : cat === "rtw" ? "RTW" : cat.charAt(0).toUpperCase() + cat.slice(1)}</button>
                      ))}
                    </div>
                  </div>

                  {gLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                      <div className="w-6 h-6 border-2 border-cruzBlack/20 border-t-cruzBlack rounded-full animate-spin" />
                      <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Loading archive…</p>
                    </div>
                  ) : serverGarments.filter(g => gFilter === "all" || g.category === gFilter).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24">
                      <p className="text-[9px] font-mono text-gray-300 uppercase tracking-widest">No garments in this category yet.</p>
                      <p className="text-[8px] font-mono text-gray-200 mt-2">Upload the first piece using the form.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-1">
                      {serverGarments
                        .filter(g => gFilter === "all" || g.category === gFilter)
                        .map(g => (
                          <div key={g.id} className="group relative border border-cruzBorder/40 bg-white overflow-hidden">
                            <div className="aspect-[3/4] w-full overflow-hidden bg-cruzGrey flex items-center justify-center relative">
                              {g.img ? (
                                <img
                                  src={g.img} alt={g.title}
                                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <span className="text-[9px] font-mono text-gray-300 uppercase tracking-widest">No Image</span>
                              )}
                            </div>
                            <div className="p-3">
                              <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-cruzGold">{g.category}</p>
                              <p className="text-[10px] font-serif mt-0.5 truncate">{g.title}</p>
                              <p className="text-[8px] font-mono text-gray-400">{g.look}</p>
                            </div>
                            <button
                              onClick={async () => {
                                if (!confirm(`Remove "${g.title}" from archive?`)) return;
                                try {
                                  const res = await fetch(`/api/garments/${g.id}`, { method: "DELETE" });
                                  if (res.ok) { refreshGarments(); showNotification("success", `"${g.title}" removed from archive.`); }
                                  else showNotification("error", "Could not remove garment.");
                                } catch { showNotification("error", "Network error."); }
                              }}
                              className="absolute top-2 right-2 w-7 h-7 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 text-[12px]"
                              title="Remove garment"
                            >✕</button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: SILHOUETTES & STOCK MANAGER */}
        {activeTab === "silhouettes" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 fade-in-up">
            {/* Left Panel: Upload Form (7 columns) */}
            <div className="lg:col-span-7 space-y-12">
              <div className="bg-white/45 backdrop-blur-sm border border-cruzBorder p-8 md:p-10 relative">
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cruzBlack/20"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cruzBlack/20"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cruzBlack/20"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cruzBlack/20"></div>

                <div className="flex justify-between items-center border-b border-cruzBorder/50 pb-4 mb-8">
                  <h2 className="text-xl font-serif tracking-wide">Add or Edit Silhouette</h2>
                  <span className="text-[8.5px] uppercase font-mono text-cruzGold bg-cruzBlack/5 px-2.5 py-1 tracking-widest border border-cruzGold/10">
                    Protip: Match look name to override static photos!
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex flex-col space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.25em] text-gray-500 font-mono">Silhouette Name</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Cruz Wool Overcoat"
                      className="w-full bg-cruzBg/50 border border-cruzBorder px-4 py-3 text-[11px] uppercase tracking-widest focus:outline-none focus:border-cruzBlack/60 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.25em] text-gray-500 font-mono">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-cruzBg/50 border border-cruzBorder px-4 py-3 text-[11px] uppercase tracking-widest focus:outline-none focus:border-cruzBlack/60 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="rtw">Ready-to-Wear</option>
                        <option value="knitwear">Knitwear</option>
                        <option value="denim">Denim</option>
                        <option value="outerwear">Outerwear</option>
                      </select>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.25em] text-gray-500 font-mono">Look Label (e.g. Look 01)</label>
                      <input
                        type="text"
                        value={look}
                        onChange={(e) => setLook(e.target.value)}
                        placeholder="e.g. Look 01 (matches & overrides existing Look 01)"
                        className="w-full bg-cruzBg/50 border border-cruzBorder px-4 py-3 text-[11px] uppercase tracking-widest focus:outline-none focus:border-cruzBlack/60 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.25em] text-gray-500 font-mono">Layout Alignment Shift</label>
                    <select
                      value={mtOffset}
                      onChange={(e) => setMtOffset(e.target.value)}
                      className="w-full bg-cruzBg/50 border border-cruzBorder px-4 py-3 text-[11px] uppercase tracking-widest focus:outline-none focus:border-cruzBlack/60 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Standard Spacing</option>
                      <option value="md:mt-20">Shift Down (Moderate)</option>
                      <option value="md:mt-32">Shift Down (Deep)</option>
                      <option value="md:-mt-16">Shift Up (Lifted)</option>
                    </select>
                  </div>

                  {/* Silhouette Photo */}
                  <div className="space-y-4 border-t border-cruzBorder/40 pt-6">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] uppercase tracking-[0.25em] text-gray-500 font-mono">Asset Source</label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setImgSourceType("preset")}
                          className={`text-[9px] uppercase tracking-wider font-mono pb-1 border-b ${
                            imgSourceType === "preset" ? "border-cruzBlack text-cruzBlack" : "border-transparent text-gray-400"
                          }`}
                        >
                          Local Presets
                        </button>
                        <button
                          type="button"
                          onClick={() => setImgSourceType("url")}
                          className={`text-[9px] uppercase tracking-wider font-mono pb-1 border-b ${
                            imgSourceType === "url" ? "border-cruzBlack text-cruzBlack" : "border-transparent text-gray-400"
                          }`}
                        >
                          Custom URL/File
                        </button>
                      </div>
                    </div>

                    {imgSourceType === "preset" ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-cruzBg/40 border border-cruzBorder/60 max-h-[220px] overflow-y-auto">
                        {presetImages.map((imgObj) => (
                          <button
                            key={imgObj.src}
                            type="button"
                            onClick={() => setPresetImg(imgObj.src)}
                            className={`group aspect-square border relative p-1 bg-white overflow-hidden transition-all duration-300 ${
                              presetImg === imgObj.src ? "border-cruzBlack ring-1 ring-cruzBlack" : "border-cruzBorder/60 hover:border-gray-400"
                            }`}
                          >
                            <img src={imgObj.src} alt={imgObj.label} className="w-full h-full object-contain filter group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            {presetImg === imgObj.src && (
                              <span className="absolute bottom-1 right-1 bg-cruzBlack text-cruzBg text-[7px] font-mono px-1 font-bold">Selected</span>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={customImgUrl}
                          onChange={(e) => setCustomImgUrl(e.target.value)}
                          placeholder="Paste image HTTPS URL..."
                          className="w-full bg-cruzBg/50 border border-cruzBorder px-4 py-3 text-[11px] uppercase tracking-widest focus:outline-none focus:border-cruzBlack/60 transition-colors"
                        />
                        <div className="flex items-center gap-4">
                          <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-mono">Or Upload File:</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              showNotification("success", "Uploading file to server…");
                              try {
                                const formData = new FormData();
                                formData.append("file", file);
                                const res = await fetch("/api/upload", { method: "POST", body: formData });
                                if (res.ok) {
                                  const { url } = await res.json();
                                  setCustomImgUrl(url);
                                  showNotification("success", "Image uploaded successfully.");
                                } else {
                                  const err = await res.json();
                                  showNotification("error", err.error || "Upload failed.");
                                }
                              } catch {
                                showNotification("error", "Network error. Upload failed.");
                              }
                            }}
                            className="text-[9px] file:bg-cruzBlack file:text-cruzBg file:border-0 file:px-3 file:py-1 file:uppercase file:text-[8px] file:tracking-widest cursor-pointer file:cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-cruzBlack hover:bg-cruzBlack/90 text-cruzBg py-4 text-[10px] uppercase tracking-[0.3em] font-medium transition-colors border border-cruzBlack relative overflow-hidden group"
                  >
                    <span className="relative z-10">Add To Archive</span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  </button>
                </form>
              </div>
            </div>

            {/* Right Panel: Stock Control Widget & Custom submissions */}
            <div className="lg:col-span-5 space-y-12">
              
              {/* Showroom Stock Control Widget */}
              <div className="bg-white/45 backdrop-blur-sm border border-cruzBorder p-8 relative">
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cruzBlack/15"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cruzBlack/15"></div>
                               <div className="flex justify-between items-center border-b border-cruzBorder/40 pb-3 mb-6">
                  <h3 className="text-[9.5px] uppercase tracking-[0.25em] text-gray-500 font-mono flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cruzGold animate-pulse"></span>
                    Showroom Stock Control
                  </h3>
                  <div className="flex gap-3">
                    {outOfStockIds.length > 0 && (
                      <button
                        onClick={() => {
                          setOutOfStockIds([]);
                          localStorage.setItem("cruz_out_of_stock_items", JSON.stringify([]));
                          window.dispatchEvent(new Event("cruz_collections_updated"));
                          showNotification("success", "All clothes reverted to available.");
                        }}
                        className="text-[7.5px] font-mono uppercase tracking-widest text-red-600 hover:underline"
                      >
                        Reset Stock
                      </button>
                    )}
                    {deletedIds.length > 0 && (
                      <button
                        onClick={() => {
                          setDeletedIds([]);
                          localStorage.setItem("cruz_deleted_items", JSON.stringify([]));
                          window.dispatchEvent(new Event("cruz_collections_updated"));
                          showNotification("success", "All removed items restored to catalog.");
                        }}
                        className="text-[7.5px] font-mono uppercase tracking-widest text-cruzGold hover:underline"
                      >
                        Restore All
                      </button>
                    )}
                  </div>
                </div>

                {/* Category select for stock control */}
                <div className="flex gap-3 mb-6 items-center">
                  <span className="text-[8.5px] uppercase font-mono tracking-widest text-gray-400">Filter Section:</span>
                  <select
                    value={selectedStockCategory}
                    onChange={(e) => setSelectedStockCategory(e.target.value)}
                    className="flex-1 bg-cruzBg/50 border border-cruzBorder px-2.5 py-1.5 text-[9px] uppercase tracking-wider font-mono focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="men">Men Collection</option>
                    <option value="women">Women Collection</option>
                    <option value="rtw">Ready-to-Wear</option>
                    <option value="knitwear">Knitwear</option>
                    <option value="denim">Denim</option>
                    <option value="outerwear">Outerwear</option>
                  </select>
                </div>

                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                  {getCategoryItems(selectedStockCategory).map((item) => {
                    const isOos = outOfStockIds.includes(item.id);
                    const isDeleted = deletedIds.includes(item.id);
                    return (
                      <div key={item.id} className={`flex items-center justify-between p-2.5 bg-cruzBg/30 border border-cruzBorder/40 hover:border-cruzBlack/20 transition-all ${isDeleted ? "opacity-60 bg-red-50/5" : ""}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-10 bg-white border border-cruzBorder/50 flex-shrink-0 flex items-center justify-center p-0.5 overflow-hidden">
                            {item.img ? (
                              <img src={item.img} className="max-h-full max-w-full object-contain" alt={item.title} />
                            ) : (
                              <span className="text-[6px] font-mono text-gray-300">—</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[8px] font-mono text-gray-400 uppercase">
                              {item.look} {isDeleted && <span className="text-red-500 font-bold ml-1">[Removed]</span>}
                            </p>
                            <p className="text-[9px] uppercase font-medium text-cruzBlack truncate max-w-[120px]">{item.title}</p>
                          </div>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleStockStatus(item.id)}
                            className={`px-2.5 py-1.5 text-[7px] font-mono uppercase tracking-widest border transition-all ${
                              isOos
                                ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                : "bg-white text-cruzBlack border-cruzBorder hover:bg-gray-50"
                            }`}
                          >
                            {isOos ? "Sold Out" : "Available"}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleDeleteStatus(item.id)}
                            className={`px-2.5 py-1.5 text-[7px] font-mono uppercase tracking-widest border transition-all ${
                              isDeleted
                                ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                : "bg-white text-gray-500 border-cruzBorder hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            }`}
                          >
                            {isDeleted ? "Restore" : "Remove"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Permanently delete "${item.title}" from the archive?`)) {
                                removeImage(item.id);
                              }
                            }}
                            className="px-2.5 py-1.5 text-[7px] font-mono uppercase tracking-widest border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Preview */}
              <div className="bg-white/45 backdrop-blur-sm border border-cruzBorder p-8 relative">
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cruzBlack/15"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cruzBlack/15"></div>
                <h3 className="text-[9px] uppercase tracking-[0.25em] text-gray-500 font-mono mb-6">Interactive Preview</h3>

                <div className={`flex flex-col group`}>
                  <div className="aspect-[3/4] overflow-hidden mb-6 bg-cruzGrey relative border border-cruzBorder/40">
                    <div className="absolute top-3 left-3 text-[8px] font-mono text-gray-400 bg-white/80 backdrop-blur-sm py-1 px-2 border border-cruzBorder/30 uppercase z-10">
                      {category}
                    </div>
                    {((imgSourceType === "preset" && presetImg) || (imgSourceType === "url" && customImgUrl)) ? (
                      <img
                        src={imgSourceType === "preset" ? presetImg : customImgUrl}
                        alt="Preview image"
                        className="w-full h-full object-contain absolute inset-0 p-4 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=700&auto=format&fit=crop";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 font-mono text-[10px] tracking-widest uppercase">
                        No Image Selected
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center border-b border-cruzBorder pb-4">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium truncate max-w-[70%]">
                      {title || "Untitled Silhouette"}
                    </h4>
                    <span className="text-[9px] text-gray-400 tracking-widest font-mono">
                      {look || "Look XX"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Custom list */}
              <div className="bg-white/45 backdrop-blur-sm border border-cruzBorder p-8 relative max-h-[400px] overflow-y-auto">
                <h3 className="text-[9px] uppercase tracking-[0.25em] text-gray-500 font-mono mb-6 border-b border-cruzBorder/40 pb-3 flex justify-between">
                  <span>Custom Submissions</span>
                  <span className="text-cruzGold">{uploadedItems.length} items</span>
                </h3>

                {uploadedItems.length === 0 ? (
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 italic py-12 text-center">
                    No custom items uploaded yet.
                  </p>
                ) : (
                  <div className="divide-y divide-cruzBorder/40">
                    {uploadedItems.map((item) => (
                      <div key={item.id} className="py-4 flex gap-4 items-center justify-between group">
                        <div className="flex gap-4 items-center truncate">
                          <div className="w-12 h-16 bg-white border border-cruzBorder/50 flex-shrink-0 p-1 flex items-center justify-center overflow-hidden">
                            {item.img ? (
                              <img src={item.img} alt={item.title} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-[6px] font-mono text-gray-300">—</span>
                            )}
                          </div>
                          <div className="truncate">
                            <h4 className="text-[10px] uppercase tracking-wider text-cruzBlack truncate">{item.title}</h4>
                            <div className="flex gap-2 items-center text-[8px] font-mono text-gray-400 uppercase mt-1">
                              <span>{item.category}</span>
                              <span>&bull;</span>
                              <span>{item.look}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-gray-400 hover:text-red-600 text-[8px] font-mono uppercase tracking-widest p-2 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WEBSITE LAYOUT & MEDIA SETTINGS */}
        {activeTab === "layout" && (
          <div className="space-y-12 fade-in-up">
            <div className="bg-white/45 backdrop-blur-sm border border-cruzBorder p-8 md:p-10 relative">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cruzBlack/20"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cruzBlack/20"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cruzBlack/20"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cruzBlack/20"></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cruzBorder/50 pb-4 mb-8">
                <div>
                  <h2 className="text-xl font-serif tracking-wide">Website Layout & Media Settings</h2>
                  <p className="text-[8px] font-mono text-gray-400 uppercase tracking-widest mt-1">Granular controls to upload or remove any asset on the flagship.</p>
                </div>
                <button
                  onClick={handleRestoreDefaults}
                  className="mt-4 sm:mt-0 border border-red-200 text-red-700 hover:bg-red-50 px-4 py-2 text-[9px] uppercase tracking-widest font-mono transition-all"
                >
                  Restore Layout Defaults
                </button>
              </div>

              {/* Group 1: Brand & Layout Texts */}
              <div className="space-y-6 pt-4">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-cruzGold border-b border-cruzBorder pb-2">1. Brand & General</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderMediaCard("Brand Logo (Overlay/Header)", "logoUrl", logoUrl)}
                  
                  <div className="group border border-cruzBorder/40 bg-white/40 p-5 transition-all duration-300 hover:border-cruzBlack/30 relative flex flex-col justify-between">
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cruzBlack/20 group-hover:border-cruzBlack/50"></div>
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-cruzBlack/20 group-hover:border-cruzBlack/50"></div>
                    <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-cruzBlack/20 group-hover:border-cruzBlack/50"></div>
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cruzBlack/20 group-hover:border-cruzBlack/50"></div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-gray-500">Homepage Hero Title text</span>
                        {heroTitle !== DEFAULTS.heroTitle && (
                          <span className="text-[7px] font-mono uppercase px-2 py-0.5 border border-cruzGold/30 text-cruzGold bg-cruzGold/5">Custom Override</span>
                        )}
                      </div>
                      <div className="aspect-[16/9] w-full bg-cruzGrey border border-cruzBorder/30 mb-4 flex items-center justify-center p-6 text-center">
                        <h4 className="text-xl font-serif text-cruzBlack uppercase tracking-wider">{heroTitle}</h4>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <span className="text-[8px] font-mono uppercase tracking-widest text-gray-400 flex-1 flex items-center">Edit text:</span>
                        {heroTitle !== DEFAULTS.heroTitle && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSingleConfig("heroTitle")}
                            className="border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-[8px] tracking-widest font-mono uppercase px-3 py-1 transition-all"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={heroTitle}
                        onChange={(e) => {
                          setHeroTitle(e.target.value);
                          saveConfig("heroTitle", e.target.value);
                        }}
                        className="w-full bg-cruzBg border border-cruzBorder px-3 py-2 text-[10px] uppercase font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 2: Homepage Hero & Landing Covers */}
              <div className="space-y-6 pt-6">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-cruzGold border-b border-cruzBorder pb-2">2. Landing & Homepage Main Media</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {renderMediaCard("Hero Cover Video Stream", "heroVideoUrl", heroVideoUrl, false)}
                  {renderMediaCard("Hero Cover Image", "heroImageUrl", heroImageUrl)}
                  
                  {/* Hero Media Type Toggle */}
                  <div className="group border border-cruzBorder/40 bg-white/40 p-5 transition-all duration-300 hover:border-cruzBlack/30 relative flex flex-col justify-between">
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cruzBlack/20 group-hover:border-cruzBlack/50"></div>
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-cruzBlack/20 group-hover:border-cruzBlack/50"></div>
                    <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-cruzBlack/20 group-hover:border-cruzBlack/50"></div>
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cruzBlack/20 group-hover:border-cruzBlack/50"></div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-gray-500">Hero Media Type</span>
                        {heroMediaType !== DEFAULTS.heroMediaType && (
                          <span className="text-[7px] font-mono uppercase px-2 py-0.5 border border-cruzGold/30 text-cruzGold bg-cruzGold/5">Custom Override</span>
                        )}
                      </div>
                      <div className="aspect-[16/9] w-full bg-cruzGrey border border-cruzBorder/30 mb-4 flex flex-col items-center justify-center p-4">
                        <span className="text-[12px] text-cruzBlack font-mono uppercase select-none font-bold">
                          {heroMediaType} Mode
                        </span>
                        <span className="text-[7px] text-gray-400 font-mono text-center mt-2 max-w-full select-none">
                          Toggle between showcasing a video stream or static imagery on flagship landing.
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <span className="text-[8px] font-mono uppercase tracking-widest text-gray-400 flex-1 flex items-center">Choose Type:</span>
                        {heroMediaType !== DEFAULTS.heroMediaType && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSingleConfig("heroMediaType")}
                            className="border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-[8px] tracking-widest font-mono uppercase px-3 py-1 transition-all"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                      <select
                        value={heroMediaType}
                        onChange={(e) => {
                          setHeroMediaType(e.target.value);
                          saveConfig("heroMediaType", e.target.value);
                        }}
                        className="w-full bg-cruzBg border border-cruzBorder px-3 py-2 text-[10px] uppercase font-mono cursor-pointer"
                      >
                        <option value="video">Cinematic Video</option>
                        <option value="image">Static Image</option>
                      </select>
                    </div>
                  </div>

                  {renderMediaCard("Home Look 01 (LHS Card)", "homeLook1Url", homeLook1Url)}
                  {renderMediaCard("Home Look 02 (RHS Card)", "homeLook2Url", homeLook2Url)}
                </div>
              </div>

              {/* Group 3: Homepage Editorial Breakouts & Search Overlay */}
              <div className="space-y-6 pt-6">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-cruzGold border-b border-cruzBorder pb-2">3. Editorial Breakouts & Search Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {renderMediaCard("Manifesto Scarcity Quote Poster", "homeQuoteUrl", homeQuoteUrl)}
                  {renderMediaCard("Bottom Campaign Break Banner", "homeCampaignUrl", homeCampaignUrl)}
                  {renderMediaCard("Search Overcoat Thumbnail", "searchLook1Url", searchLook1Url)}
                  {renderMediaCard("Search Trench Thumbnail", "searchLook2Url", searchLook2Url)}
                </div>
              </div>

              {/* Group 4: Interactive 3D Tailoring */}
              <div className="space-y-6 pt-6">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-cruzGold border-b border-cruzBorder pb-2">4. 3D Tailoring Material Room</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderMediaCard("3D Canvas Background Image", "tailoringBrandImg", tailoringBrandImg)}
                </div>
              </div>

              {/* Group 5: Showroom Cinematic Slides */}
              <div className="space-y-6 pt-6">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-cruzGold border-b border-cruzBorder pb-2">5. Interactive Kinetic Showroom</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {renderMediaCard("Showroom Intro Video Stream", "showroomVideoUrl", showroomVideoUrl, false)}
                  {renderMediaCard("Slide 2 Video Stream", "showroomVideoSlideUrl", showroomVideoSlideUrl, false)}
                  {renderMediaCard("Showroom Slide 1", "showroomSlide1Url", showroomSlide1Url)}
                  {renderMediaCard("Showroom Slide 3", "showroomSlide3Url", showroomSlide3Url)}
                  {renderMediaCard("Showroom Slide 4", "showroomSlide4Url", showroomSlide4Url)}
                </div>
              </div>

              {/* Group 6: Collection Covers */}
              <div className="space-y-6 pt-6">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-cruzGold border-b border-cruzBorder pb-2">6. Category Bleed Covers</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {renderMediaCard("Outerwear Cover", "outerwearCoverUrl", outerwearCoverUrl)}
                  {renderMediaCard("Women Cover", "womenCoverUrl", womenCoverUrl)}
                  {renderMediaCard("Women Editorial Banner", "womenEditorialUrl", womenEditorialUrl)}
                  {renderMediaCard("Men Cover", "menCoverUrl", menCoverUrl)}
                  {renderMediaCard("Knitwear Cover", "knitwearCoverUrl", knitwearCoverUrl)}
                  {renderMediaCard("Denim Cover", "denimCoverUrl", denimCoverUrl)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CLIENT FITTING INQUIRIES */}
        {activeTab === "inquiries" && (
          <div className="space-y-8 fade-in-up">
            <div className="bg-white/45 backdrop-blur-sm border border-cruzBorder p-8 md:p-10 relative">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cruzBlack/20"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cruzBlack/20"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cruzBlack/20"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cruzBlack/20"></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cruzBorder/50 pb-4 mb-8">
                <div>
                  <h2 className="text-xl font-serif tracking-wide">Client Showroom Inquiries</h2>
                  <p className="text-[8.5px] font-mono text-gray-400 uppercase tracking-widest mt-1">
                    Manage private fitting and custom-tailoring requests logged by clients.
                  </p>
                </div>
                {inquiries.length > 0 && (
                  <button
                    onClick={clearAllInquiries}
                    className="mt-4 sm:mt-0 border border-red-200 text-red-700 hover:bg-red-50 px-4 py-2 text-[9px] uppercase tracking-widest font-mono transition-all"
                  >
                    Archive All Inquiries
                  </button>
                )}
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-cruzBorder/60 bg-cruzBg/20">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 italic">
                    No fitting requests logged in the showroom archive yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {inquiries.map((inq) => (
                    <div 
                      key={inq.id}
                      className={`border p-6 bg-white relative flex flex-col justify-between transition-all duration-300 hover:shadow-md ${
                        inq.status === "contacted" ? "border-cruzBorder/40 opacity-70" : "border-cruzGold/40 shadow-sm"
                      }`}
                    >
                      {/* Top HUD bar */}
                      <div className="flex justify-between items-center mb-4 border-b border-cruzBorder/40 pb-2">
                        <span className="text-[8px] font-mono text-gray-400">{inq.timestamp}</span>
                        <span className={`text-[7.5px] font-mono uppercase tracking-widest px-2 py-0.5 border ${
                          inq.status === "contacted" 
                            ? "border-green-200 text-green-700 bg-green-50" 
                            : "border-cruzGold/30 text-cruzGold bg-cruzGold/5 animate-pulse"
                        }`}>
                          {inq.status === "contacted" ? "Contacted" : "Action Required"}
                        </span>
                      </div>

                      {/* Client details / look card split */}
                      <div className="flex gap-4 mb-6">
                        <div className="w-16 h-20 bg-cruzBg border border-cruzBorder/50 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {inq.lookImg ? (
                            <img src={inq.lookImg} alt={inq.lookTitle} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <span className="text-[8px] font-mono text-gray-300">—</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[7.5px] font-mono text-cruzGold uppercase tracking-widest">{inq.lookLabel}</span>
                          <h4 className="text-[10px] uppercase font-bold text-cruzBlack truncate mb-2">{inq.lookTitle}</h4>
                          
                          <div className="space-y-1 text-[8.5px] font-mono text-gray-600">
                            <p><span className="text-gray-400">Client:</span> {inq.clientName}</p>
                            <p>
                              <span className="text-gray-400">Email:</span>{" "}
                              <a href={`mailto:${inq.clientEmail}`} className="underline hover:text-cruzGold">{inq.clientEmail}</a>
                            </p>
                            <p><span className="text-gray-400">Atelier Size:</span> {inq.clientSize}</p>
                          </div>
                        </div>
                      </div>

                      {/* Notes block */}
                      {inq.clientNotes && (
                        <div className="bg-cruzBg/50 border border-cruzBorder/40 p-3 mb-6">
                          <span className="text-[7.5px] font-mono uppercase text-gray-400 tracking-wider">Client Notes:</span>
                          <p className="text-[9px] italic text-gray-600 mt-1 uppercase tracking-wide leading-relaxed">
                            &ldquo;{inq.clientNotes}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-3 pt-2 border-t border-cruzBorder/40">
                        <button
                          type="button"
                          onClick={() => toggleInquiryStatus(inq.id)}
                          className={`flex-1 py-2 text-[8px] font-mono uppercase tracking-widest border transition-all ${
                            inq.status === "contacted"
                              ? "bg-white text-cruzBlack border-cruzBorder hover:bg-gray-50"
                              : "bg-cruzBlack text-cruzBg border-cruzBlack hover:bg-cruzBlack/90"
                          }`}
                        >
                          {inq.status === "contacted" ? "Mark Pending" : "Mark Contacted"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="px-3 border border-red-200 text-red-600 hover:bg-red-50 text-[8px] font-mono uppercase tracking-widest transition-all"
                        >
                          Archive
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
