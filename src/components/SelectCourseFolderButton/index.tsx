import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import formatCourse from '../../services/formatCourse';
import { addNewCourse } from '../../store/modules/catalog/actions';
import { ICourse, IVideo } from '../../store/modules/catalog/types';
import { AddCourseButton } from './styles';

interface SelectCourseFolderButtonProps {
  setIsLoading: (isLoading: boolean) => void;
}

const SelectCourseFolderButton: React.FC<SelectCourseFolderButtonProps> = ({
  setIsLoading,
}) => {
  const dispatch = useDispatch();

  const inputFile = useRef<HTMLInputElement>({} as HTMLInputElement);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const files = (e.target.files as unknown) as IVideo[];
    const updatedLoadedCourse = await formatCourse(files);
    setIsLoading(false);
    dispatch(addNewCourse(updatedLoadedCourse as ICourse));
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  return (
    <AddCourseButton type="button" onClick={onButtonClick}>
      <input
        style={{ display: 'none' }}
        ref={inputFile}
        onChange={(e) => handleFileUpload(e)}
        type="file"
        directory=""
        webkitdirectory=""
      />
      Add
    </AddCourseButton>
  );
};
export default SelectCourseFolderButton;
