import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #12181b;
  margin: 0;
  flex: 1;
  padding: 0;
`;

export const CourseContainer = styled.button`
  background-color: #2a2e35;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 250px;
  border-radius: 5px;
  margin: 16px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  transition: transform 100ms ease-in-out;

  &:hover {
    -webkit-transform: translateY(-3px);
    transform: translateY(-3px);
    transition: transform 100ms ease-in-out;
  }
`;

export const Thumbnail = styled.img`
  width: 90%;
  height: 100%;
  padding-horizontal: 16px;
  padding-top: 16px;
  align-self: center;
  object-fit: contain;
`;

export const InfoContainer = styled.div`
  padding: 16px;
  text-align: start;
  display: flex;
  flex-direction: column;
`;

export const CourseTitle = styled.p`
  font-family: 'OpenSans-Bold';
  text-align: start;
  color: #ffffff;
`;

export const ProgressLabel = styled.p`
  font-family: 'OpenSans-Regular';
  color: #fff;
  font-size: 13px;
`;
