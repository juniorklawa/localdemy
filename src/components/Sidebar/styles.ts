import styled from 'styled-components';

interface ClassProps {
  isSelected: boolean;
}

export const Container = styled.div`
  background-color: #0e1315;
  flex: 1;
`;

export const AutoplayControllerContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 16px;
  align-items: center;
`;

export const AutoPlayLabel = styled.p`
  font-family: OpenSans-Regular;
  color: #fff;
  margin-right: 8px;
`;

export const CourseProgress = styled.p`
  font-family: OpenSans-Bold;
  color: #fff;
  margin-left: 16px;
`;

export const CourseContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  height: 60px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: #12181b;
`;

export const SidebarToolbar = styled.div`
  height: 60px;
  align-self: center;
  flex-direction: row;
  padding-right: 16px;
  padding-left: 16px;
  display: flex;
  justify-content: space-between;
`;

export const ModuleToggle = styled.button`
  padding: 24px;
  display: flex;
  flex-direction: column;
  border-top: 0.5px solid #12181b;
  border-bottom: 0.5px solid #12181b;
`;

export const ModuleHeader = styled.div`
  flex-direction: row;
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export const ModuleTitle = styled.p`
  color: #fff;
  font-family: OpenSans-Bold;
  flex: 3;
  text-align: left;
  font-size: 16px;
`;

export const ModuleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const CheckBoxContainer = styled.div`
  margin-top: -16px;
`;

export const LessonName = styled.p`
  color: #fff;
  font-family: OpenSans-Regular;
  flex: 3;
  text-align: left;
  margin-left: 0px;
  font-size: 14px;
`;

export const LessonInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const LessonDuration = styled.p`
  color: #e0e0e0;
  font-family: OpenSans-Regular;
  flex: 3;
  text-align: left;
  margin-left: 4px;
  font-size: 12px;
`;

export const ToggleButton = styled.button``;

export const ModuleInfo = styled.p`
  margin-top: 4px;
  color: #e0e0e0;
  font-family: OpenSans-Regular;
  flex: 3;
  text-align: left;
  font-size: 14px;
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
  height: 88.5vh;
  align-items: center;
  overflow: auto;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
`;

export const OptionButtonLabel = styled.p`
  margin-right: 8px;
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
