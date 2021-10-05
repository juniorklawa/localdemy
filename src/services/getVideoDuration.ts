import { IVideo } from '../store/modules/catalog/types';

const getVideoDuration = async (file: IVideo) => {
  return new Promise((resolve) => {
    if (file?.type === 'video/mp4' && file.path) {
      const video = document.createElement('video');

      video.setAttribute('src', file?.path);

      video.onloadedmetadata = () => {
        resolve(video.duration);
      };
    } else {
      resolve(null);
    }
  });
};

export default getVideoDuration;
