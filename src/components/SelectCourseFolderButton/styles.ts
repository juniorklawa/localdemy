import styled from 'styled-components';

export const AddCourseButton = styled.button`
  background-color: #00c853;
  width: 120px;
  color: #fff;
  border-radius: 50px;
  font-family: OpenSans-Bold;
  height: 40px;
  transition: background-color 200ms ease-in-out, transform 300ms ease-in-out;

  &:hover {
    -webkit-transform: translateY(-3px);
    transform: translateY(-3px);
    transition: background-color 200ms ease-in-out, transform 300ms ease-in-out;
  }
`;
