import styled from 'styled-components';
import ReactModal from 'react-modal';

interface BottomTabButtonProps {
  isEqual: boolean;
}

export const StyledModal = styled(ReactModal)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

export const SectionTitle = styled.h1`
  color: #fff;
  font-family: OpenSans-Bold;
`;

export const CourseTitle = styled.h1`
  color: #fff;
  font-family: OpenSans-Bold;
  margin-top: 32px;
`;

export const CourseTitleInput = styled.input`
  border-radius: 6px;
  margin-top: 8px;
  font-size: 14px;
  border: none;
  width: 100%;
  font-family: OpenSans-Regular;
  padding: 16px;
  color: #fff;
  background-color: #292f31;
`;

export const CloseButton = styled.button`
  color: #fff;
  display: flex;
  align-self: flex-end;
  font-family: OpenSans-Bold;
`;

export const EditIcon = styled.img`
  width: 20px;
  height: 20px;
  position: relative;
  bottom: 0px;
  top: 32px;
  left: -40px;
  right: 0px;

  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

export const ModuleCard = styled.div`
  padding-right: 16px;
  margin-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  background-color: #090d0e;
  border-radius: 6px;
`;

export const BottomButton = styled.button<BottomTabButtonProps>`
  background-color: ${({ isEqual }) => (isEqual ? '#171b1c' : '#00C853')};
  width: 50%;
  height: 50px;
  color: ${({ isEqual }) => (isEqual ? '#616161' : '#ffffff')};
  font-size: 18px;
  font-family: OpenSans-Bold;
`;

export const ModuleInput = styled.input`
  border-radius: 6px;
  margin-top: 8px;
  font-size: 14px;
  border: none;
  width: 100%;
  font-family: OpenSans-Regular;
  padding: 16px;
  color: #fff;
  background-color: #292f31;
`;

export const ModuleTitle = styled.h2`
  color: #fff;
  font-family: OpenSans-Bold;
  margin-top: 32px;
`;

export const Container = styled.div`
  background-color: #0e1315;
  width: 50%;
  padding: 32px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
`;

export const ThumbnailButton = styled.button`
  display: flex;
`;

export const Thumbnail = styled.img`
  width: 50%;
  margin-top: 8px;
  border-radius: 6px;
`;

export const UploadImageInput = styled.input`
  display: none;
`;

export const Icon = styled.img`
  width: 20px;
  height: 20px;

  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;
