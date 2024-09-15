import React from "react";
import { View, TouchableOpacity, Linking, Image, StyleSheet } from "react-native";
import youtube_icon from "../../assets/images/youtube.png";

interface YoutubeImageProps {
  youtubeUrl: string;
  thumbnail: {
    default: {
      url: string;
      width: number;
      height: number;
    };
    medium: {
      url: string;
      width: number;
      height: number;
    };
    high: {
      url: string;
      width: number;
      height: number;
    };
  };
}

const YoutubeImage: React.FC<YoutubeImageProps> = ({ youtubeUrl, thumbnail }) => {
  const handlePress = () => {
    if (youtubeUrl) {
      const videoId = youtubeUrl.includes("youtube.com")
        ? youtubeUrl.split("v=")[1]
        : youtubeUrl.split("/").pop();
      const youtubeAppUrl = `vnd.youtube:${videoId}`;
      const youtubeBrowserUrl = `https://www.youtube.com/watch?v=${videoId}`;

      Linking.canOpenURL(youtubeAppUrl)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(youtubeAppUrl);
          } else {
            return Linking.openURL(youtubeBrowserUrl);
          }
        })
        .catch((err) => console.error("An error occurred", err));
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.videoContainer}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.thumbnailOverlay}>
          <Image source={youtube_icon} style={styles.youtubeIcon} />
        </View>
        <Image source={{ uri: thumbnail.medium.url }} style={styles.postImage} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    position: 'relative',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  youtubeIcon: {
    width: 60,
    height: 60,
    opacity: 0.9,
    tintColor: 'white',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});

export default YoutubeImage;
