/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef } from 'react';
import {
  DragDropContext,
  Draggable,
  DragUpdate,
  Droppable,
} from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import close from '../../assets/close.png';
import editing from '../../assets/editing.png';
import menu from '../../assets/menu.png';
import { updateCourse } from '../../store/modules/catalog/actions';
import { ICourse, IVideo } from '../../store/modules/catalog/types';
import {
  BottomButton,
  CloseButton,
  Container,
  CourseTitle,
  CourseTitleInput,
  DragBox,
  EditIcon,
  Icon,
  InputWrapper,
  ModuleCard,
  ModuleInput,
  ModuleTitle,
  SectionTitle,
  StyledModal,
  Thumbnail,
  ThumbnailButton,
  UploadImageInput,
} from './styles';

interface EditCourseModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  currentEditCourse: ICourse;
  currentCourse: ICourse;
  setCurrentCourse: (currentCourse: ICourse) => void;
  setCurrentEditCourse: (currentCourse: ICourse) => void;
  currentIndex: number;
  currentModuleIndex: number;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  currentEditCourse,
  currentCourse,
  setCurrentCourse,
  setCurrentEditCourse,
  currentIndex,
  currentModuleIndex,
}) => {
  const dispatch = useDispatch();

  const inputFile = useRef<HTMLInputElement>({} as HTMLInputElement);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const imagePath = (event.target.files[0].path as unknown) as string;

    const updatedCurrentCourse: ICourse = {
      ...currentCourse,
      courseThumbnail: imagePath,
    };

    setCurrentEditCourse(updatedCurrentCourse);
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  const handleOnInputLessonNameChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    lessonId: string,
    moduleIndex: number
  ) => {
    const updatedCurrentCourseLessons = currentEditCourse.modules[
      moduleIndex
    ].lessons?.map((lesson) => {
      if (lesson.id === lessonId) {
        return {
          ...lesson,
          name: e.target.value,
        };
      }

      return lesson;
    });

    const updatedModules = currentEditCourse.modules.map((module, index) => {
      if (index === moduleIndex) {
        return {
          ...module,
          lessons: updatedCurrentCourseLessons,
        };
      }

      return module;
    });

    const updatedCurrentCourse: ICourse = {
      ...currentEditCourse,
      modules: updatedModules,
      lastIndex: currentIndex,
      lastModuleIndex: currentModuleIndex,
    };
    setCurrentEditCourse(updatedCurrentCourse);
  };

  const handleOnSaveChangesPress = async () => {
    const courseWithChanges = currentEditCourse;
    setCurrentCourse(courseWithChanges);
    dispatch(updateCourse(courseWithChanges));
    setIsModalOpen(false);
  };

  const swapItems = (
    lessons: IVideo[],
    source: number,
    destination: number
  ) => {
    const updatedLessons = [...lessons];

    const temp = lessons[source];
    updatedLessons[source] = updatedLessons[destination];
    updatedLessons[destination] = temp;

    return updatedLessons;
  };

  const handleOnDragEnd = (result: DragUpdate) => {
    if (!result.destination) {
      return;
    }

    const draggedModuleIndex = Number(result.source.droppableId);

    const items = currentEditCourse.modules[draggedModuleIndex].lessons;

    const source = result.source.index;
    const destination = result.destination.index;

    const formattedLessons = swapItems(items, source, destination);

    const updatedModules = currentEditCourse.modules.map((module, index) => {
      if (index === draggedModuleIndex) {
        return {
          ...module,
          lessons: formattedLessons,
        };
      }

      return module;
    });

    const updatedCurrentEditCourse: ICourse = {
      ...currentEditCourse,
      modules: updatedModules,
    };

    setCurrentEditCourse(updatedCurrentEditCourse);
  };

  const handleOnInputModuleNameChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    moduleIndex: number
  ) => {
    const updatedCurrentCourseModule = currentEditCourse.modules.map(
      (item, index) => {
        if (index === moduleIndex) {
          return {
            ...item,
            title: e.target.value,
          };
        }

        return item;
      }
    );

    const updatedCurrentCourse: ICourse = {
      ...currentEditCourse,
      modules: updatedCurrentCourseModule,
      lastIndex: currentIndex,
      lastModuleIndex: currentModuleIndex,
    };

    setCurrentEditCourse(updatedCurrentCourse);
  };

  const handleOnTitleInput = (title: string) => {
    const updatedEditCourse: ICourse = {
      ...currentEditCourse,
      courseTitle: title,
    };
    setCurrentEditCourse(updatedEditCourse);
  };

  return (
    <StyledModal
      isOpen={isModalOpen}
      ariaHideApp={false}
      onRequestClose={() => setIsModalOpen(false)}
      contentLabel="modal"
    >
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Container>
          <CloseButton onClick={() => setIsModalOpen(false)}>
            <Icon src={close} />
          </CloseButton>

          <SectionTitle>Cover</SectionTitle>

          <ThumbnailButton onClick={onButtonClick}>
            <UploadImageInput
              ref={inputFile}
              onChange={async (e) => handleImageUpload(e)}
              type="file"
            />
            <Thumbnail
              src={currentEditCourse.courseThumbnail}
              alt="course thumbnail"
            />

            <EditIcon src={editing} />
          </ThumbnailButton>

          <CourseTitle>Title</CourseTitle>

          <CourseTitleInput
            onChange={(e) => handleOnTitleInput(e.target.value)}
            value={currentEditCourse?.courseTitle}
          />
          {currentEditCourse?.modules && currentEditCourse?.modules[0]?.title && (
            <>
              <CourseTitle>Modules</CourseTitle>
            </>
          )}

          {currentEditCourse?.modules?.map((module, moduleIndex) => {
            return (
              <DragDropContext key={module.id} onDragEnd={handleOnDragEnd}>
                <ModuleCard key={module.id}>
                  {currentEditCourse.modules[moduleIndex].title && (
                    <>
                      <ModuleTitle>Title</ModuleTitle>
                      <CourseTitleInput
                        onChange={(e) =>
                          handleOnInputModuleNameChange(e, moduleIndex)
                        }
                        key={module.id}
                        value={module.title}
                      />
                    </>
                  )}

                  <ModuleTitle>Lessons</ModuleTitle>

                  <Droppable droppableId={module.id}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {currentEditCourse?.modules[moduleIndex]?.lessons.map(
                          (lesson, lessonIndex) => {
                            return (
                              <Draggable
                                key={lesson.id}
                                draggableId={lesson.id}
                                index={lessonIndex}
                              >
                                {(draggableProvided) => (
                                  <div
                                    ref={draggableProvided.innerRef}
                                    {...draggableProvided.draggableProps}
                                    {...draggableProvided.dragHandleProps}
                                  >
                                    <InputWrapper>
                                      <ModuleInput
                                        onChange={(e) =>
                                          handleOnInputLessonNameChange(
                                            e,
                                            lesson.id,
                                            moduleIndex
                                          )
                                        }
                                        key={lesson.id}
                                        value={lesson.name}
                                      />

                                      <DragBox>
                                        <Icon
                                          style={{ height: 24, width: 24 }}
                                          src={menu}
                                        />
                                      </DragBox>
                                    </InputWrapper>
                                  </div>
                                )}
                              </Draggable>
                            );
                          }
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </ModuleCard>
              </DragDropContext>
            );
          })}
        </Container>
        <BottomButton
          isEqual={
            JSON.stringify(currentCourse) === JSON.stringify(currentEditCourse)
          }
          disabled={
            JSON.stringify(currentCourse) === JSON.stringify(currentEditCourse)
          }
          type="button"
          onClick={handleOnSaveChangesPress}
        >
          Save changes
        </BottomButton>
      </DragDropContext>
    </StyledModal>
  );
};

export default EditCourseModal;
