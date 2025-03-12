import { IReport } from "@/typings/Report.type"
import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";

interface IReportItemProps {
    report: IReport;
}

export const ReportItem = ({report}: IReportItemProps) => {
    return (
        <Box key={report.id} p={4} bg="white" borderRadius="md" boxShadow="md" mt={4}>
          <Flex align="center">
            {/* <Avatar name={report.description} bg="blue.500" color="white" size="md" mr={3} /> */}
            <Box flex="1">
              <Text fontWeight="bold">{report.description}</Text>
              <Flex align="center" mt={1} color="gray.600">
                <Icon as={FaMapMarkerAlt} mr={1} />
                <Text>Lat: {report.location.latitude}, Lng: {report.location.longitude}</Text>
              </Flex>
              <Flex align="center" mt={1} color="gray.600">
                <Icon as={FaClock} mr={1} />
                <Text>Status: {report.status}</Text>
              </Flex>
            </Box>
            <Button colorScheme="blue" size="sm">View Details</Button>
          </Flex>
        </Box>
    )
}