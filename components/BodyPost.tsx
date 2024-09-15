import { truncateText } from "@/lib/truncateText";
import React from "react";
import { View, Text } from "react-native";

interface BodyPostProps {
    content: string;
}

const renderContent = (content: string) => {
    const truncated = truncateText(content, 100).trim();

    // Regular expression to match words starting with "#"
    const parts = truncated.split(/(\#\w+)/g);

    return parts.map((part, index) => {
        if (part.startsWith("#")) {
            // Split the part into the hashtag and the rest of the word
            const spaceIndex = part.indexOf(' ');
            const wordToStyle = spaceIndex !== -1 ? part.slice(0, spaceIndex) : part;
            const restOfText = spaceIndex !== -1 ? part.slice(spaceIndex) : '';

            return (
                <Text key={index}>
                    <Text style={{ color: '#007AFF' }}>{wordToStyle}</Text>
                    {restOfText}
                </Text>
            );
        }
        return (
            <Text key={index}>
                {part}
            </Text>
        );
    });
};

const BodyPost: React.FC<BodyPostProps> = ({ content }) => {
    return (
        <View  >
            <Text style={{ fontSize: 16 ,
                fontFamily: 'Cairo-Regular',
            }}>{renderContent(content)}</Text>
        </View>
    );
};

export default BodyPost;
