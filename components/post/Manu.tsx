import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  GestureResponderEvent,
  I18nManager,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { deleteObject, ref } from "firebase/storage";
import { deleteDoc, doc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_STORAGE } from "@/lib/firebase/firebaseConfig";

const Menu = ({ Postid, imageURL }: { Postid: string; imageURL: string|undefined }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const toggleMenu = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    setMenuPosition({ x: pageX, y: pageY });
    isOpen ? closeMenu() : openMenu();
  };

  const openMenu = () => {
    setIsOpen(true);
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 0, duration: 200, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setIsOpen(false));
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (imageURL) {
        const imageRef = ref(FIREBASE_STORAGE, imageURL);
        await deleteObject(imageRef);
      }
      await deleteDoc(doc(FIREBASE_DB, "posts", Postid));
      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsLoading(false);
      closeMenu();
    }
  };

  const renderMenuItem = (iconName: keyof typeof Ionicons.glyphMap, text: string, color: string, onPress: () => void) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={iconName} size={22} color={color} />
      <Text style={[styles.menuText, { color }]}>{text}</Text>
    </TouchableOpacity>
  );

  const getMenuPosition = () => {
    const { width, height } = Dimensions.get('window');
    const menuWidth = 220;
    const menuHeight = 150;
    let left = I18nManager.isRTL ? menuPosition.x : menuPosition.x - menuWidth;
    let top = menuPosition.y - menuHeight / 2;

    if (left < 0) left = 0;
    if (left + menuWidth > width) left = width - menuWidth;
    if (top < 0) top = 0;
    if (top + menuHeight > height) top = height - menuHeight;

    return { top, [I18nManager.isRTL ? 'right' : 'left']: left };
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.optionsButton} onPress={toggleMenu}>
        <Ionicons name="ellipsis-horizontal" size={24} color="#007AFF" style={styles.icon} />
      </TouchableOpacity>
      <Modal visible={isOpen} transparent={true} animationType="none" onRequestClose={closeMenu}>
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.modalOverlay}>
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
              </View>
            )}
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.menuContainer,
                  {
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }],
                    position: "absolute",
                    ...getMenuPosition(),
                  },
                ]}
              >
                {renderMenuItem("create-outline", "Edit", "#007AFF", () => console.log("Edit pressed"))}
                {renderMenuItem("trash-outline", "Delete", "#FF3B30", handleDelete)}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    width: 40,
    [I18nManager.isRTL ? 'marginLeft' : 'marginRight']: 16,
  },
  optionsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  icon: {
    transform: [{ rotate: I18nManager.isRTL ? "-90deg" : "90deg" }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    width: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  menuItem: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  menuText: {
    [I18nManager.isRTL ? 'marginRight' : 'marginLeft']: 16,
    fontSize: 17,
    fontWeight: "500",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default Menu;
