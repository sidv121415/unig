import { useEffect, useState, useRef, useCallback } from "react"
import apiClient from "../service/apiClient"
import {
    SimpleGrid,
    Card,
    CardBody,
    Image,
    Heading,
    Text,
    Badge,
    HStack,
    Box,
    Icon,
    Skeleton,
    SkeletonText,
    useColorModeValue,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    VStack,
    Spinner,
    Link,
    Button
} from "@chakra-ui/react"
import { motion, AnimatePresence } from "framer-motion"
import { FaWindows, FaPlaystation, FaXbox, FaApple, FaLinux, FaAndroid, FaReddit, FaGamepad, FaHeart, FaTrash } from "react-icons/fa"
import { MdPhoneIphone, MdClose, MdWeb } from "react-icons/md"

import { BsGlobe, BsCalendar, BsStar, BsLink45Deg, BsHeartFill } from "react-icons/bs"
import { useAuth } from "../context/AuthContext"
import backendClient from "../service/backendClient"
import { useToast } from "@chakra-ui/react"

// --- Icons Map ---
const iconMap: { [key: string]: any } = {
    pc: FaWindows,
    playstation: FaPlaystation,
    xbox: FaXbox,
    nintendo: BsGlobe,
    mac: FaApple,
    linux: FaLinux,
    android: FaAndroid,
    ios: MdPhoneIphone,
    web: BsGlobe
}

// --- Interfaces ---
// --- Interfaces ---
interface Game {
    id: number;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    rating: number; // Double in backend
    releaseDate: string; // YYYY-MM-DD
    genre: string;
}

// --- Components ---
const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionHeading = motion(Heading);

// 1. Compact Grid Card (Image Only + Hover Title)
const GameCard = ({ game, onClick }: { game: Game; onClick: () => void }) => {
    return (
        <MotionCard
            layoutId={`card-${game.id}`}
            onClick={onClick}
            borderRadius="xl"
            overflow="hidden"
            cursor="pointer"
            height="300px" // Taller for better image show
            position="relative"
            whileHover={{ scale: 1.02 }}
            role="group"
        >
            <MotionBox layoutId={`image-${game.id}`} height="100%" width="100%">
                <Image
                    src={game.imageUrl}
                    alt={game.title}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                />
            </MotionBox>

            {/* Title Overlay on Hover */}
            <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                bgGradient="linear(to-t, blackAlpha.900, transparent)"
                p={4}
                opacity={0}
                transition="opacity 0.3s"
                _groupHover={{ opacity: 1 }}
                display="flex"
                alignItems="flex-end"
                height="50%"
            >
                <Heading size="md" color="white" noOfLines={2}>
                    {game.title}
                </Heading>
            </Box>
        </MotionCard>
    )
}

// 2. Expanded Detail Card (Overlay)
const ExpandedCard = ({ gameId, onClose, initialGameData }: { gameId: number; onClose: () => void; initialGameData?: Game }) => {
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
    const bgColor = useColorModeValue("white", "gray.900");

    const [details, setDetails] = useState<Game | null>(initialGameData || null);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();
    const toast = useToast();
    const [existingUserGame, setExistingUserGame] = useState<any>(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Check if game is in user library
    useEffect(() => {
        if (isAuthenticated) {
            backendClient.get(`/games/${gameId}/check`)
                .then(res => setExistingUserGame(res.data))
                .catch(() => setExistingUserGame(null));
        }
    }, [gameId, isAuthenticated]);

    const handleAddToLibrary = async (status: "PLAYING" | "PLAN_TO_PLAY") => {
        if (!details) return;
        setActionLoading(true);

        try {
            const res = await backendClient.post("/games", {
                gameId: details.id,
                title: details.title,
                backgroundImage: details.imageUrl,
                rawgRating: details.rating,
                description: details.description,
                price: details.price,
                genre: details.genre,
                releaseDate: details.releaseDate,
                status: status
            });
            setExistingUserGame(res.data);
            toast({
                title: status === "PLAN_TO_PLAY" ? "Added to Wishlist!" : "Added to My Games!",
                status: "success",
                duration: 2000
            });
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.response?.data || "Could not add game",
                status: "error",
                duration: 2000
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveFromLibrary = async () => {
        if (!existingUserGame) return;
        setActionLoading(true);
        try {
            await backendClient.delete(`/games/${gameId}`);
            setExistingUserGame(null);
            toast({
                title: "Removed from Library",
                status: "info",
                duration: 2000
            });
        } catch (err) {
            toast({
                title: "Error",
                description: "Could not remove game",
                status: "error",
                duration: 2000
            });
        } finally {
            setActionLoading(false);
        }
    };

    // Use fetched details if available, otherwise fallback to initial data
    const game = details || initialGameData;

    if (!game) return null;

    return (
        <>
            {/* Blurred Backdrop */}
            <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                position="fixed"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="blackAlpha.800"
                backdropFilter="blur(5px)"
                zIndex={98}
                onClick={onClose}
            />

            {/* Expanded Card Container */}
            <Box
                position="fixed"
                top="85px"
                left={0}
                right={0}
                bottom={0}
                zIndex={98}
                display="flex"
                alignItems="center"
                justifyContent="center"
                pointerEvents="none"
                p={4}
            >
                <MotionCard
                    layoutId={`card-${gameId}`}
                    width={{ base: "95%", md: "900px" }}
                    maxHeight="calc(100vh - 100px)"
                    overflowY="auto"
                    bg={bgColor}
                    borderRadius="2xl"
                    border="1px solid"
                    borderColor={borderColor}
                    boxShadow="dark-lg"
                    pointerEvents="auto"
                >
                    <Box position="relative" height="400px">
                        <MotionBox layoutId={`image-${gameId}`} height="100%" width="100%">
                            <Image
                                src={game.imageUrl}
                                alt={game.title}
                                objectFit="cover"
                                width="100%"
                                height="100%"
                            />
                        </MotionBox>

                        <Icon
                            as={MdClose}
                            position="absolute"
                            top={4}
                            right={4}
                            color="white"
                            boxSize={8}
                            cursor="pointer"
                            bg="blackAlpha.500"
                            borderRadius="full"
                            p={1}
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            _hover={{ bg: "blackAlpha.800" }}
                        />

                        {/* Action Buttons (Top Left) */}
                        {isAuthenticated && (
                            <HStack position="absolute" top={4} left={4} spacing={3}>
                                {existingUserGame ? (
                                    <Button
                                        leftIcon={<Icon as={FaTrash} />}
                                        onClick={(e) => { e.stopPropagation(); handleRemoveFromLibrary(); }}
                                        isLoading={actionLoading}
                                        colorScheme="red"
                                        variant="solid"
                                        size="sm"
                                        backdropFilter="blur(10px)"
                                        boxShadow="0 4px 12px rgba(0,0,0,0.3)"
                                    >
                                        Remove from {existingUserGame.status === 'PLAN_TO_PLAY' ? 'Wishlist' : 'My Games'}
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            leftIcon={<Icon as={FaHeart} />}
                                            onClick={(e) => { e.stopPropagation(); handleAddToLibrary("PLAN_TO_PLAY"); }}
                                            isLoading={actionLoading}
                                            colorScheme="pink"
                                            variant="solid"
                                            size="sm"
                                            backdropFilter="blur(10px)"
                                            boxShadow="0 4px 12px rgba(0,0,0,0.3)"
                                        >
                                            Wishlist
                                        </Button>
                                        <Button
                                            leftIcon={<Icon as={FaGamepad} />}
                                            onClick={(e) => { e.stopPropagation(); handleAddToLibrary("PLAYING"); }}
                                            isLoading={actionLoading}
                                            colorScheme="purple"
                                            variant="solid"
                                            size="sm"
                                            backdropFilter="blur(10px)"
                                            boxShadow="0 4px 12px rgba(0,0,0,0.3)"
                                        >
                                            My Games
                                        </Button>
                                    </>
                                )}
                            </HStack>
                        )}

                        <Box position="absolute" bottom={0} left={0} right={0} bgGradient="linear(to-t, blackAlpha.900, transparent)" p={8}>
                            <Heading size="3xl" color="white" mb={4} fontFamily="'Orbitron', sans-serif">{game.title}</Heading>
                            <HStack spacing={4}>
                                <Badge colorScheme="purple" variant="solid">{game.genre}</Badge>
                            </HStack>
                        </Box>
                    </Box>

                    <CardBody p={8}>
                        <VStack align="stretch" spacing={6}>
                            {/* Key Stats Row */}
                            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                                <Box>
                                    <Text color="gray.500" fontSize="sm" mb={1}>Rating</Text>
                                    <Badge colorScheme={game.rating >= 4.0 ? "green" : "yellow"} fontSize="xl" px={2} borderRadius="md">
                                        {game.rating || "N/A"}
                                    </Badge>
                                </Box>
                                <Box>
                                    <Text color="gray.500" fontSize="sm" mb={1}>Release Date</Text>
                                    <Text fontWeight="bold" fontSize="lg">{game.releaseDate}</Text>
                                </Box>
                                <Box>
                                    <Text color="gray.500" fontSize="sm" mb={1}>Price</Text>
                                    <Text fontWeight="bold" fontSize="lg">${game.price}</Text>
                                </Box>
                            </SimpleGrid>

                            {/* Accordion for Details */}
                            <Accordion allowMultiple defaultIndex={[0]}>
                                <AccordionItem border="none">
                                    <h2>
                                        <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                                            <Box flex="1" textAlign="left" fontWeight="bold" fontSize="xl" color={useColorModeValue("gray.700", "white")}>
                                                About
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4} px={0}>
                                        {loading ? (
                                            <SkeletonText noOfLines={4} spacing='4' />
                                        ) : (
                                            <Text color="gray.400" lineHeight="tall" whiteSpace="pre-line">
                                                {game.description || "No description available."}
                                            </Text>
                                        )}
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                        </VStack>
                    </CardBody>
                </MotionCard>
            </Box>
        </>
    )
}

// --- Skeleton Component ---
const GameCardSkeleton = () => {
    return (
        <Card borderRadius="xl" overflow="hidden" padding={0} bg={useColorModeValue("white", "whiteAlpha.50")} height="300px">
            <Skeleton height="100%" />
        </Card>
    )
}

// --- Main Component ---
// 🔹 Infinite Scroll & Search logic
// 🔹 Infinite Scroll & Search logic
interface AllGamesProps {
    searchText?: string;
    selectedPlatform?: number | null;
    selectedGenre?: string | null;
    libraryType?: 'my-games' | 'wishlist' | null;
}

function AllGames({ searchText = "", selectedPlatform = null, selectedGenre = null, libraryType = null }: AllGamesProps) {
    const [games, setGames] = useState<Game[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastGameElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        }, { rootMargin: '200px' });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore]);

    // 🔹 Reset on search/filter change
    useEffect(() => {
        setGames([]);
        setPage(1);
        setHasMore(true);
    }, [searchText, selectedPlatform, selectedGenre, libraryType]);

    // 🔹 Fetch Games when page or filters change
    useEffect(() => {
        const fetchGames = async () => {
            setIsLoading(true);
            try {
                if (libraryType) {
                    // Fetch from Backend (User Library)
                    const endpoint = `/games/${libraryType}`;
                    const res = await backendClient.get<any[]>(endpoint);

                    // Map UserGame to Game interface
                    const mappedGames: Game[] = res.data.map(g => ({
                        id: g.gameId, // The rawg ID stored in user_game
                        title: g.title,
                        description: g.description,
                        price: g.price || 59.99,
                        imageUrl: g.backgroundImage,
                        rating: g.rawgRating,
                        releaseDate: g.releaseDate,
                        genre: g.genre
                    }));

                    setGames(mappedGames);
                    setHasMore(false);
                    setIsLoading(false);
                    return;
                }

                // Fetch from Public API (uniG Backend or RAWG proxy)
                let endpoint = "/games";
                const params: any = {};

                if (searchText) {
                    endpoint = "/games/search";
                    params.query = searchText;
                } else if (selectedGenre) {
                    endpoint = `/games/genre/${selectedGenre}`;
                }

                const res = await apiClient.get<Game[]>(endpoint, { params });

                // The local API likely returns the array directly
                setGames(res.data);

                // Disable infinite scroll for now
                setHasMore(false);
                setIsLoading(false);

            } catch (err: any) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchGames();
    }, [searchText, selectedPlatform, selectedGenre, libraryType]);

    const selectedGame = games.find(g => g.id === selectedId);

    if (error) return <Text color="red.500" textAlign="center" mt={10}>Failed to load games: {error}</Text>;

    return (
        <Box padding="20px" maxWidth="1600px" margin="0 auto">
            <MotionHeading
                mb={8}
                fontFamily="'Orbitron', sans-serif"
                fontSize="4xl"
                fontWeight="black"
                textAlign="left"
                bgGradient="linear(to-r, #fff, #777)"
                bgClip="text"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
            >
                {libraryType === 'wishlist' ? "My Wishlist" :
                    libraryType === 'my-games' ? "My Collection" :
                        searchText ? `Search Results: "${searchText}"` : "Top Games"}
            </MotionHeading>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4, "2xl": 5 }} spacing={6}>
                {games.map((game, index) => {
                    if (games.length === index + 1) {
                        // Last element (for infinite scroll observer)
                        return (
                            <div ref={lastGameElementRef} key={game.id}>
                                <GameCard
                                    game={game}
                                    onClick={() => setSelectedId(game.id)}
                                />
                            </div>
                        );
                    } else {
                        return (
                            <GameCard
                                key={game.id}
                                game={game}
                                onClick={() => setSelectedId(game.id)}
                            />
                        );
                    }
                })}

                {/* Loading Skeletons for next page or initial load */}
                {isLoading && Array.from({ length: 8 }).map((_, i) => (
                    <GameCardSkeleton key={`loading-${i}`} />
                ))}
            </SimpleGrid>

            {!hasMore && !isLoading && games.length > 0 && (
                <Text textAlign="center" mt={10} color="gray.500">You've reached the end!</Text>
            )}

            {/* Animation Presence for Expanded Card */}
            <AnimatePresence>
                {selectedId && (selectedGame || selectedId) && (
                    <ExpandedCard
                        gameId={selectedId} // Pass ID to fetch full details
                        initialGameData={selectedGame} // Pass current data for immediate render
                        onClose={() => setSelectedId(null)}
                    />
                )}
            </AnimatePresence>
        </Box>
    )
}

export default AllGames
