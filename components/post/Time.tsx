import { Timestamp } from "firebase/firestore";
import React from "react";
import { Text, View, StyleSheet, I18nManager } from "react-native";

interface TimeProps {
  timestamp: Timestamp;
}

const Time: React.FC<TimeProps> = ({ timestamp }) => {
  const now = new Date();
  const postDate = timestamp.toDate();
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  let timeAgo;
  if (diffInSeconds < 60) {
    timeAgo = 'الآن';
  } else if (diffInSeconds < 3600) {
    timeAgo = `${Math.floor(diffInSeconds / 60)} د`;
  } else if (diffInSeconds < 86400) {
    timeAgo = `${Math.floor(diffInSeconds / 3600)} س`;
  } else if (diffInSeconds < 2592000) {
    timeAgo = `${Math.floor(diffInSeconds / 86400)} ي`;
  } else if (diffInSeconds < 31536000) {
    timeAgo = `${Math.floor(diffInSeconds / 2592000)} ش`;
  } else {
    timeAgo = `${Math.floor(diffInSeconds / 31536000)} سنة`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{timeAgo}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});

export default Time;