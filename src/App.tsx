// App.tsx
import { useRef, useState, useEffect } from "react";
import {
  Grid,
  GridItem,
  Box,
  useColorMode,
} from "@chakra-ui/react";

import NavBarComp from "./components/NavBarComp";
import AllGames from "./components/AllGames";
import SideBar from "./components/SideBar";
import Hero from "./components/Hero";
import GridMotion from "./components/GridMotion";

type Game = {
  background_image?: string;
};

function App() {
  const [showGames, setShowGames] = useState(false);
  const [gridItems, setGridItems] = useState<(string)[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<number | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [libraryType, setLibraryType] = useState<'my-games' | 'wishlist' | null>(null);
  const gamesRef = useRef<HTMLDivElement>(null);
  const { setColorMode } = useColorMode();

  // 🔹 Always start in dark mode (black themed)
  useEffect(() => {
    setColorMode("dark");
  }, [setColorMode]);

  // Handle Search
  const handleSearch = (text: string) => {
    setSearchText(text);
    setLibraryType(null); // Reset library view
    // Scroll to games section
    if (gamesRef.current) {
      gamesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Filter Selection (from Nav/Sidebar)
  const handleFilterSelect = (type: string, value: string | number) => {
    if (type === 'search') {
      setSearchText(value as string);
      setSelectedPlatform(null);
      setSelectedGenre(null);
      setLibraryType(null);
    } else if (type === 'platform') {
      setSelectedPlatform(value as number);
      setLibraryType(null);
    } else if (type === 'genre') {
      setSelectedGenre(value as string);
      setLibraryType(null);
    } else if (type === 'library') {
      setLibraryType(value as 'my-games' | 'wishlist');
      setSearchText("");
      setSelectedGenre(null);
      setSelectedPlatform(null);
    }

    if (gamesRef.current) {
      gamesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Show sidebar / compact nav when scrolling past Hero
  useEffect(() => {
    const handleScroll = () => {
      // Trigger when we are close to the games section (approx 70% down the viewport)
      const triggerPoint = window.innerHeight * 0.7;
      const scrolled = window.scrollY > triggerPoint;
      setShowGames(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Fetch 5–6 images from RAWG API on load for GridMotion
  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Use local API
        const res = await fetch("http://localhost:8080/api/games");
        // Expecting an array of games directly
        const data = await res.json();
        const results: any[] = Array.isArray(data) ? data : (data.results || []);

        const urls = results
          .map((g) => g.imageUrl || g.background_image) // Fallback for safety
          .filter(Boolean) as string[];

        if (!urls.length) return;

        // We want unique images for each cell (4 rows x 12 cols = 48 items)
        // If we have fewer than 48, we'll repeat some.
        const cols = 12;
        const rows = 4;
        const totalItems = cols * rows;

        const items = Array.from({ length: totalItems }, (_, i) => urls[i % urls.length]);

        setGridItems(items);
      } catch (err) {
        console.error("Error fetching grid images:", err);
      }
    };

    fetchImages();
  }, []);

  // Handle Logo Click (Reset)
  const handleLogoClick = () => {
    setSearchText("");
    setSelectedPlatform(null);
    setSelectedGenre(null);
    setLibraryType(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box color="white" minH="100vh">
      {/* Sidebar appears when we scroll down */}
      <SideBar isVisible={showGames} onFilterSelect={handleFilterSelect} />

      {/* Global Black Overlay for "Whole Page Black" transition */}
      <Box
        position="fixed"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        bg="black"
        zIndex={1}
        opacity={showGames ? 1 : 0}
        pointerEvents="none"
        transition="opacity 0.4s ease"
      />

      <Grid templateAreas={`"nav" "main"`}>
        <GridItem area={"nav"} position="sticky" top={4} zIndex={100} width="100%" display="flex" justifyContent="center">
          <NavBarComp forceCompact={showGames} onSearch={handleSearch} onFilterSelect={handleFilterSelect} onLogoClick={handleLogoClick} />
        </GridItem>

        <GridItem area={"main"} position="relative">
          {/* 🔹 Background: GridMotion (Fixed & Blurred) */}
          <Box
            position="fixed"
            top={0}
            left={0}
            width="100vw"
            height="100vh"
            overflow="hidden"
            zIndex={0}
            filter="blur(6px) brightness(0.6)"
          >
            <GridMotion items={gridItems} gradientColor="black" />
          </Box>

          {/* 🔹 Content: Hero & Games (Relative on top) */}
          <Box
            pl={showGames ? "260px" : "0"}
            transition="padding-left 0.3s ease"
            position="relative"
            zIndex={2}
          >
            {/* Hero Section - Matches background height */}
            <Box height="100vh" mb={0}>
              <Hero />
            </Box>

            {/* Games Section */}
            <div
              ref={gamesRef}
              style={{
                minHeight: "100vh",
                position: "relative",
                zIndex: 3,
                backgroundColor: "black",
                paddingTop: "50px", // moved padding inside to be part of the black background
                paddingBottom: "50px",
                marginTop: "-2px" // overlap slightly to prevent hairline gaps
              }}
            >
              <AllGames searchText={searchText} selectedPlatform={selectedPlatform} selectedGenre={selectedGenre} libraryType={libraryType} />
            </div>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default App;
