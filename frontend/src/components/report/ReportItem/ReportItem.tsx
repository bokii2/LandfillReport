import { IReport } from "@/typings/Report.type";
import {
  Badge,
  Button,
  Card,
  CardBody,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { FiCalendar, FiFileText, FiMapPin } from "react-icons/fi";
import NextLink from "next/link";

export const ReportItem = ({ report }: { report: IReport }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "green";
      case "pending":
        return "yellow";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card
      bg={bgColor}
      borderColor={borderColor}
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        transform: "translateY(-2px)",
        shadow: "lg",
        borderColor: "green.200",
      }}
    >
      <CardBody>
        <VStack align="start" spacing={4}>
          <HStack justify="space-between" w="full">
            <HStack spacing={2}>
              <Badge
                colorScheme={getStatusColor(report.status)}
                variant="subtle"
              >
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </Badge>
            </HStack>
            <Icon as={FiFileText} color={textColor} />
          </HStack>

          <VStack align="start" spacing={2} w="full">
            <Text color={textColor} fontSize="m" lineHeight="tall">
              {report.description}
            </Text>
          </VStack>

          <HStack justify="space-between" w="full" pt={2}>
            <VStack align="start" spacing={1}>
              <HStack spacing={1}>
                <Icon as={FiMapPin} boxSize={3} color={textColor} />
                <Text fontSize="xs" color={textColor}>
                  Lat: {report.location?.latitude ?? "N/A"}, Lng:{" "}
                  {report.location?.longitude ?? "N/A"}
                </Text>
              </HStack>
              <HStack spacing={1}>
                <Icon as={FiCalendar} boxSize={3} color={textColor} />
                <Text fontSize="xs" color={textColor}>
                  {report.createdAt
                    ? formatDate(report.createdAt.toString())
                    : "No date"}
                </Text>
              </HStack>
            </VStack>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="green"
              as={NextLink}
              href={`/report/${report.id}`}
            >
              View Details
            </Button>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};
