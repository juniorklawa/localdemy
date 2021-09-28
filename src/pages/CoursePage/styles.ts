import styled from 'styled-components';
import ReactModal from 'react-modal';

interface ClassProps {
  isSelected: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0px;
  flex: 1;
  height: 100vh;
  padding: 0px;
  /* height: 100%; */
  overflow: hidden;
`;

export const ModuleContainerButton = styled.button`
  padding: 24px;
  display: flex;
  flex-direction: column;
  border-top: 0.5px solid #12181b;
  border-bottom: 0.5px solid #12181b;
`;

export const Toolbar = styled.div`
  display: flex;
  background-color: #263238;
  align-items: center;
  padding: 16px;
  flex: row;
  justify-content: space-between;
`;

export const ClassSubContainerButton = styled.button`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 4px;
  padding-bottom: 4px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const ClassContainerButton = styled.button<ClassProps>`
  min-height: 70px;
  padding: 16px;
  align-items: center;
  background-color: ${({ isSelected }) => (isSelected ? '#414648' : '#292F31')};
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const NavigationContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 8px;
`;

export const OptionButton = styled.button`
  font-family: OpenSans-Regular;
  color: #fff;
  align-items: center;
  justify-content: center;
  display: flex;
`;

export const ClassesContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #0e1315;
  width: 100%;
  height: 90vh;
  align-items: center;
  overflow: auto;
`;

export const VideoContainer = styled.div`
  width: 100%;
`;

export const LessonTitle = styled.h2`
  color: #fff;
  font-family: OpenSans-Bold;
  margin-top: 16px;
  margin-left: 16px;
`;

export const BottomTab = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  width: 100%;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
`;

export const OptionButtonLabel = styled.p`
  margin-right: 8px;
`;

export const CourseTitle = styled.h3`
  color: #fff;
  font-family: OpenSans-ExtraBold;
  margin-left: 8px;
`;

export const GoBackButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const Icon = styled.img`
  width: 20px;
  height: 20px;

  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

export const PlayIcon = styled.img`
  opacity: 0.5;
  width: 12px;
  height: 12px;
`;

export const ToggleIcon = styled.img`
  width: 18;
  height: 18px;
`;

export const StyledModal = styled(ReactModal)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

export const ModalContainer = styled.div`
  background-color: '#fff';
  max-width: 700px;
  display: flex;
  padding: 3em 2em;
`;
