import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { IVideo, IModule, ICourse } from '../store/modules/catalog/types';
import getVideoDuration from './getVideoDuration';
import naturalSorting from './naturalSorting';
import not_available from '../assets/not_available.png';

const formatCourse = async (files: IVideo[]) => {
  if (files && files.length) {
    const formattedFiles: IVideo[] = [];

    for await (const file of files) {
      const fileName = file.path.substring(file.path.lastIndexOf('/') + 1);
      const formattedFile: IVideo = {
        name: fileName.replace(/\.[^/.]+$/, ''),
        path: file.path,
        type: file.type,
        duration: (await getVideoDuration(file)) as number,
      };

      formattedFiles.push(formattedFile);
    }

    const validImageTypes = [
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/jpg',
    ];

    const thumbnailFile = formattedFiles.find(
      (file) =>
        file.name.includes('thumbnail') && validImageTypes.includes(file.type)
    );

    const foldersList = path.dirname(formattedFiles[0].path).split(path.sep);

    const folderName =
      foldersList[
        thumbnailFile ? foldersList.length - 1 : foldersList.length - 2
      ];

    const courseId = uuidv4();

    const sortedFormatedFiles = formattedFiles
      .sort((a, b) => {
        return naturalSorting(a.name, b.name);
      })
      .filter((file) => file.type.includes('video'));

    const courseModules: IModule[] = [];

    sortedFormatedFiles.forEach((formattedFile) => {
      const allParentsFolders = path
        .dirname(formattedFile.path)
        .split(path.sep);

      const courseTitleIndex = allParentsFolders.findIndex(
        (file) => file === folderName
      );

      const parentFolderName = allParentsFolders[courseTitleIndex + 1];

      const moduleExists = courseModules.find(
        (module) => module.title === parentFolderName
      );

      if (!moduleExists) {
        courseModules.push({
          title: parentFolderName,
          lessons: [formattedFile],
          sectionActive: true,
        });
        return;
      }

      moduleExists.lessons.push(formattedFile);
    });

    const updatedLoadedCourse: ICourse = {
      modules: courseModules.sort((a, b) => {
        return naturalSorting(a.title, b.title);
      }),
      courseTitle: folderName as string,
      lastAccessedDate: new Date().getTime(),
      id: courseId,
      courseThumbnail: thumbnailFile?.path || not_available,
      videoSpeed: 1,
      videoVolume: 1,
    };
    return updatedLoadedCourse;
  }
};

export default formatCourse;
