import { lazy } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Center, Flex, Heading, Image, VStack } from '@chakra-ui/react';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Error = lazy(()=> import('../components/Error'));
const TaskSection = lazy(() => import('../components/TaskSection'));

import LoadingTask from '../components/LoadingTask';
import useToastMsg from '../customHooks/useToastMsg';
import { updateTask } from '../redux/tasks/tasks.actions';
import LazyLoadHandler from '../components/LazyLoadHandler';

function Board() {
     const { loading, error, data: board } = useSelector(store => store.tasksManager)
     const dispatch = useDispatch()
     const toastMsg = useToastMsg();

     const handleDragEnd = (result) => {
          const { destination, source, draggableId } = result;
          if (!result || !destination || (source.droppableId === destination.droppableId)) return;
          dispatch(updateTask(draggableId, board._id, { status: destination.droppableId.split("_")[0] }, toastMsg))
     }

     return (
          <>
               <Navbar />

               <Flex className='container'>
                    <Box className='sidebar'>
                         <Sidebar />
                    </Box>
                    {
                         error.status ? (
                              <LazyLoadHandler>
                                   <Center>
                                        <Error>
                                             <Heading size="md">{error.message}</Heading>
                                        </Error>
                                   </Center>
                              </LazyLoadHandler>
                         ) :
                              board.tasks ?
                                   (
                                        <>
                                             <DragDropContext onDragEnd={handleDragEnd}>
                                                  <Box className='tasks'>
                                                       {loading && <div className='loading-overlay'></div>}
                                                       {
                                                            ['Todo', 'Doing', 'Done'].map((el, ind) => <LazyLoadHandler suspenceFallback={<LoadingTask />} key={ind}>
                                                                 < TaskSection title={el} />
                                                            </LazyLoadHandler>)
                                                       }
                                                  </Box>
                                             </DragDropContext>
                                        </>

                                   ) :
                                   (
                                        <Center>
                                             <VStack>
                                                  <Image w="80%" src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg?w=740&t=st=1698086334~exp=1698086934~hmac=0c56bec7fec4c211ba4aeba6eb92039acf796955c8c389384dd65feca9d7461e" />
                                                  <Heading color='var(--primary-color)' textAlign="center">SELECT A BOARD TO SEE THE DATA</Heading>
                                             </VStack>
                                        </Center>
                                   )
                    }
               </Flex>
          </>
     )
}

export default Board