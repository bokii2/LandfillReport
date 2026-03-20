"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Container,
  Heading,
  VStack,
  HStack,
  IconButton,
  useColorMode,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Badge,
  Spacer,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Skeleton,
} from "@chakra-ui/react";
import {
  FiSun,
  FiMoon,
  FiMenu,
  FiFileText,
  FiMapPin,
  FiUsers,
  FiSettings,
  FiChevronDown,
  FiClock,
  FiExternalLink,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
} from "react-icons/fi";
import { IUserProfile } from "@/typings/UserProfile.type";
import useSWR, { mutate } from "swr";
import { swrKeys } from "@/fetchers/swrKeys";
import { fetcher } from "@/fetchers/fetcher";
import { INewsArticle } from "@/typings/NewsArticle.type";
import { IReport } from "@/typings/Report.type";
import dynamic from "next/dynamic";

const HomeMap = dynamic(() => import("@/components/home/Homemap"), { ssr: false });

export default function LandfillHomepage() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(0);

  // ─── All hooks at top ─────────────────────────────────────────────────────
  const pageBg              = useColorModeValue("#F7F8FA", "#0F1117");
  const navBg               = useColorModeValue("rgba(255,255,255,0.85)", "rgba(23,27,38,0.85)");
  const cardBg              = useColorModeValue("#FFFFFF", "#171B26");
  const cardBorder          = useColorModeValue("rgba(0,0,0,0.07)", "rgba(255,255,255,0.06)");
  const cardShadow          = useColorModeValue(
    "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
    "0 1px 3px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.3)"
  );
  const hoverShadow         = useColorModeValue("0 4px 20px rgba(0,0,0,0.10)", "0 4px 24px rgba(0,0,0,0.5)");
  const subtleText          = useColorModeValue("#6B7280", "#8B92A5");
  const strongText          = useColorModeValue("#111827", "#F0F2F7");
  const accentGreen         = useColorModeValue("#16A34A", "#22C55E");
  const accentGreenSoft     = useColorModeValue("green.50", "rgba(34,197,94,0.08)");
  const dividerColor        = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)");
  const hoverBg             = useColorModeValue("gray.50", "rgba(255,255,255,0.04)");
  const navBorder           = useColorModeValue("rgba(0,0,0,0.07)", "rgba(255,255,255,0.06)");
  const drawerBg            = useColorModeValue("#FFFFFF", "#171B26");
  const heroBgGradient      = useColorModeValue(
    "linear(to-br, white, green.50)",
    "linear(to-br, #171B26, #0F1A12)"
  );
  const newsCardHoverBorder = useColorModeValue("rgba(22,163,74,0.3)", "rgba(34,197,94,0.2)");
  const skeletonStart       = useColorModeValue("gray.100", "rgba(255,255,255,0.05)");
  const skeletonEnd         = useColorModeValue("gray.200", "rgba(255,255,255,0.08)");
  // ──────────────────────────────────────────────────────────────────────────

  const { data: user } = useSWR<IUserProfile>(swrKeys.me, fetcher);
  const isAdmin = user?.role === "ADMIN";

  const { data: newsData, error: newsError, isLoading: newsLoading } = useSWR<{
    content: INewsArticle[];
    totalPages: number;
    number: number;
  }>(`${swrKeys.news}?page=${page}&size=6`, fetcher);

  const { data: reports, isLoading: reportsLoading } = useSWR<IReport[]>(swrKeys.reports, fetcher);

  // ─── Derive real stats from reports ────────────────────────────────────────
  const totalReports   = reports?.length ?? 0;
  const approved       = reports?.filter((r) => r.status === "APPROVED").length ?? 0;
  const pending        = reports?.filter((r) => r.status === "PENDING").length ?? 0;
  const complianceRate = totalReports > 0 ? Math.round((approved / totalReports) * 100) : 0;

  const stats = [
    {
      label: "Total Reports",
      value: reportsLoading ? null : String(totalReports),
      icon: FiFileText,
      color: "#2563EB",
      softColor: "rgba(37,99,235,0.1)",
    },
    {
      label: "Approved",
      value: reportsLoading ? null : String(approved),
      icon: FiCheckCircle,
      color: "#16A34A",
      softColor: "rgba(22,163,74,0.1)",
    },
    {
      label: "Pending Review",
      value: reportsLoading ? null : String(pending),
      icon: FiAlertCircle,
      color: "#D97706",
      softColor: "rgba(217,119,6,0.1)",
    },
    {
      label: "Approval Rate",
      value: reportsLoading ? null : `${complianceRate}%`,
      icon: FiTrendingUp,
      color: "#7C3AED",
      softColor: "rgba(124,58,237,0.1)",
    },
  ];
  // ──────────────────────────────────────────────────────────────────────────

  const navItems = [
    ...(isAdmin
      ? [{ name: "Reports", href: "/reports" }]
      : [{ name: "Send Report", href: "/send-report" }]),
    ...(!isAdmin ? [{ name: "My Reports", href: "/my-reports" }] : []),
  ];

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    mutate(swrKeys.me, null, { revalidate: false });
    window.location.href = "/";
  };

  const cardStyle = {
    bg: cardBg,
    border: "1px solid",
    borderColor: cardBorder,
    borderRadius: "16px",
    boxShadow: cardShadow,
    overflow: "hidden" as const,
  };

  // ─── Navbar ───────────────────────────────────────────────────────────────
  const NavBar = () => (
    <Box
      bg={navBg}
      borderBottom="1px solid" borderColor={navBorder}
      position="sticky" top={0} zIndex={1000}
      backdropFilter="blur(12px)"
    >
      <Box h="3px" bgGradient="linear(to-r, green.400, teal.400)" />
      <Container maxW="6xl">
        <Flex h="20" alignItems="center" justifyContent="space-between" py={4}>
          <HStack spacing={8} alignItems="center">
            <HStack spacing={2}>
              <Box
                w={8} h={8} borderRadius="lg" bg={accentGreenSoft}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={FiMapPin} color={accentGreen} boxSize={4} />
              </Box>
              <Heading size="md" color={strongText} fontWeight="700" letterSpacing="-0.02em">
                LandFill<Text as="span" color={accentGreen}>Pro</Text>
              </Heading>
            </HStack>

            <HStack as="nav" spacing={1} display={{ base: "none", md: "flex" }}>
              {navItems.map((item) => (
                <Link
                  key={item.name} href={item.href}
                  px={3} py={2} borderRadius="8px"
                  fontSize="md" fontWeight="500" color={subtleText}
                  _hover={{ textDecoration: "none", color: strongText, bg: hoverBg }}
                  transition="all 0.15s"
                >
                  {item.name}
                </Link>
              ))}
            </HStack>
          </HStack>

          <Spacer />

          <HStack spacing={2}>
            <IconButton
              size="md" variant="ghost" aria-label="Toggle color mode"
              icon={colorMode === "light" ? <FiMoon size={17} /> : <FiSun size={17} />}
              onClick={toggleColorMode}
              color={subtleText} borderRadius="8px"
              _hover={{ color: strongText, bg: hoverBg }}
            />

            <Menu>
              <MenuButton
                as={Button} size="md"
                rightIcon={<FiChevronDown size={15} />}
                variant="ghost" color={subtleText}
                fontWeight="500" fontSize="md" borderRadius="8px"
                _hover={{ color: strongText, bg: hoverBg }}
              >
                {user?.username || "Account"}
              </MenuButton>
              <MenuList
                bg={cardBg} border="1px solid" borderColor={cardBorder}
                borderRadius="12px" boxShadow={hoverShadow} py={1}
              >
                <MenuItem icon={<FiUsers size={13} />} fontSize="md" borderRadius="8px">Profile</MenuItem>
                <MenuItem icon={<FiSettings size={13} />} fontSize="md" borderRadius="8px" onClick={handleLogout}>
                  Log out
                </MenuItem>
              </MenuList>
            </Menu>

            <IconButton
              size="sm" variant="ghost" aria-label="Open menu"
              icon={<FiMenu size={17} />}
              onClick={onOpen}
              display={{ base: "flex", md: "none" }}
              color={subtleText} borderRadius="8px"
              _hover={{ color: strongText, bg: hoverBg }}
            />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Box minH="100vh" bg={pageBg}>
      <NavBar />

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay backdropFilter="blur(4px)" />
        <DrawerContent bg={drawerBg} borderLeft="1px solid" borderColor={cardBorder}>
          <DrawerCloseButton color={subtleText} />
          <DrawerHeader borderBottom="1px solid" borderColor={dividerColor} fontSize="md" fontWeight="600" color={strongText}>
            Navigation
          </DrawerHeader>
          <DrawerBody py={4}>
            <VStack spacing={1} align="stretch">
              {navItems.map((item) => (
                <Link
                  key={item.name} href={item.href}
                  px={4} py={3.5} borderRadius="10px"
                  fontSize="md" fontWeight="500" color={subtleText}
                  _hover={{ textDecoration: "none", color: strongText, bg: hoverBg }}
                  onClick={onClose} transition="all 0.15s"
                >
                  {item.name}
                </Link>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Container maxW="6xl" py={10}>
        <VStack spacing={8} align="stretch">

          {/* ── Hero + Map ───────────────────────────────────────────────── */}
          <Box {...cardStyle}>
            <Box bgGradient={heroBgGradient} px={10} py={10} textAlign="center">
              <VStack spacing={4}>
                <Badge
                  px={3} py={1} borderRadius="full"
                  bg={accentGreenSoft} color={accentGreen}
                  fontSize="11px" fontWeight="600"
                  letterSpacing="0.08em" textTransform="uppercase"
                  border="1px solid" borderColor={dividerColor}
                >
                  Landfill Management Platform
                </Badge>

                <Heading
                  fontSize={{ base: "2xl", md: "3xl" }}
                  color={strongText} fontWeight="800"
                  letterSpacing="-0.03em" lineHeight="1.15" maxW="3xl"
                >
                  Comprehensive Landfill{" "}
                  <Text as="span" color={accentGreen}>Management</Text>{" "}
                  & Reporting
                </Heading>
              </VStack>
            </Box>
          </Box>

          

          {/* ── Stats ────────────────────────────────────────────────────── */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            {stats.map((stat) => (
              <Box
                key={stat.label}
                {...cardStyle}
                px={5} py={5} textAlign="center"
                transition="all 0.2s"
                _hover={{ transform: "translateY(-2px)", boxShadow: hoverShadow }}
              >
                <Box
                  w={10} h={10} borderRadius="12px" mx="auto" mb={3}
                  bg={stat.softColor}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Icon as={stat.icon} color={stat.color} boxSize={5} />
                </Box>

                {stat.value === null ? (
                  <Skeleton
                    h="28px" w="50%" mx="auto" mb={1}
                    startColor={skeletonStart} endColor={skeletonEnd}
                    borderRadius="6px"
                  />
                ) : (
                  <Text fontSize="2xl" fontWeight="800" color={stat.color} lineHeight="1">
                    {stat.value}
                  </Text>
                )}

                <Text color={subtleText} fontSize="md" fontWeight="500" mt={1} letterSpacing="0.02em">
                  {stat.label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>

          <HomeMap />

          {/* ── News ─────────────────────────────────────────────────────── */}
          <Box {...cardStyle}>
            <Box px={6} py={4} borderBottom="1px solid" borderColor={dividerColor}>
              <HStack justify="space-between" align="center">
                <HStack spacing={2}>
                  <Box
                    w={7} h={7} borderRadius="lg" bg={accentGreenSoft}
                    display="flex" alignItems="center" justifyContent="center"
                  >
                    <Icon as={FiFileText} color={accentGreen} boxSize={3.5} />
                  </Box>
                  <Text fontWeight="600" fontSize="lg" color={strongText}>Latest News & Updates</Text>
                </HStack>
              </HStack>
            </Box>

            <Box p={6}>
              {newsLoading && (
                <Text color={subtleText} fontSize="md" textAlign="center" py={8}>Loading news…</Text>
              )}
              {newsError && (
                <Text color="red.400" fontSize="md" textAlign="center" py={8}>Failed to load news.</Text>
              )}
              {newsData?.content && newsData.content.length > 0 && (
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                  {newsData.content.map((article) => (
                    <Box
                      key={article.id}
                      bg={pageBg} border="1px solid" borderColor={cardBorder}
                      borderRadius="12px" p={5}
                      transition="all 0.2s"
                      _hover={{ transform: "translateY(-2px)", boxShadow: hoverShadow, borderColor: newsCardHoverBorder }}
                    >
                      <VStack align="start" spacing={3}>
                        <Badge
                          px={2.5} py={0.5} borderRadius="full"
                          colorScheme="blue" variant="subtle"
                          fontSize="11px" fontWeight="600"
                          letterSpacing="0.04em" textTransform="uppercase"
                        >
                          {article.source}
                        </Badge>

                        <Text fontWeight="600" fontSize="md" color={strongText} lineHeight="1.6" noOfLines={2}>
                          {article.title}
                        </Text>

                        <HStack justify="space-between" w="full">
                          <HStack spacing={1.5}>
                            <Icon as={FiClock} boxSize={3} color={subtleText} />
                            <Text fontSize="md" color={subtleText} fontWeight="500">
                              {formatDate(article.scrapedAt)}
                            </Text>
                          </HStack>
                          <Button
                            as="a" href={article.url} target="_blank"
                            size="xs" variant="ghost"
                            rightIcon={<FiExternalLink size={11} />}
                            color={accentGreen} fontWeight="600" fontSize="xs"
                            borderRadius="6px" _hover={{ bg: accentGreenSoft }}
                          >
                            Open
                          </Button>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              )}

              {/* ── Pagination ───────────────────────────────────────────── */}
              <HStack justify="center" pt={6} spacing={3}>
                <Button
                  size="sm" variant="ghost" isDisabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  color={subtleText} borderRadius="8px"
                  _hover={{ color: strongText, bg: hoverBg }}
                >
                  Previous
                </Button>
                <Text fontSize="sm" color={subtleText} fontWeight="500">
                  Page {(newsData?.number ?? 0) + 1} of {newsData?.totalPages ?? 1}
                </Text>
                <Button
                  size="sm" variant="ghost"
                  isDisabled={page >= (newsData?.totalPages ?? 1) - 1}
                  onClick={() => setPage((p) => p + 1)}
                  color={subtleText} borderRadius="8px"
                  _hover={{ color: strongText, bg: hoverBg }}
                >
                  Next
                </Button>
              </HStack>
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}