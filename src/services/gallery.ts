import { launchImageLibrary } from 'react-native-image-picker';
import { GalleryResult, SelectedPhoto } from '../types';

/**
 * Wraps the native picker so screens only ever deal with a small, typed result
 * instead of the library's loosely-shaped response.
 */
export const pickPhotoFromLibrary = async (): Promise<GalleryResult> => {
  try {
    const response = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      // Keeps very large camera shots from being decoded at full resolution.
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 0.9,
      includeBase64: false,
    });

    if (response.didCancel) {
      return { status: 'cancelled' };
    }
    if (response.errorCode) {
      return {
        status: 'error',
        message:
          response.errorCode === 'permission'
            ? 'Agreem does not have permission to open your photos.'
            : 'We could not open your photo library. Please try again.',
      };
    }

    const asset = response.assets?.[0];
    if (!asset?.uri) {
      return { status: 'error', message: 'That photo could not be loaded. Please pick another.' };
    }

    const photo: SelectedPhoto = {
      uri: asset.uri,
      width: asset.width ?? 0,
      height: asset.height ?? 0,
      fileName: asset.fileName ?? 'Selected photo',
      fileSize: asset.fileSize ?? 0,
    };
    return { status: 'selected', photo };
  } catch (error) {
    console.warn('[gallery] picker threw', error);
    return { status: 'error', message: 'Something went wrong opening your photos.' };
  }
};
