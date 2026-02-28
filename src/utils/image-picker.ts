import * as ImagePicker from "expo-image-picker";

export interface SelectedImage {
  uri: string;
  name: string;
  type: string;
}

/**
 * Reusable utility to pick an image from the device's library.
 * Handles permissions and returns a standardized object with uri, name, and type.
 */
export const pickImageFromLibrary = async (
  options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  }
): Promise<SelectedImage | null> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== "granted") {
    throw new Error("Sorry, we need camera roll permissions to make this work!");
  }

  const result = await ImagePicker.launchImageLibraryAsync(options);

  if (!result.canceled) {
    const asset = result.assets[0];
    const uri = asset.uri;
    
    const filename = uri.split("/").pop() || "image.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1] === 'jpg' ? 'jpeg' : match[1]}` : `image/jpeg`;

    return {
      uri,
      name: filename,
      type,
    };
  }

  return null;
};
