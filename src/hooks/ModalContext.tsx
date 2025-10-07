import i18next from 'i18next';
import React, {
  ReactNode,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import Modal, { ModalProps, PresentationStyle } from 'react-native-modal';
import {
  IconCloudOff,
  IconMoodSad,
  IconWifiOff,
} from 'tabler-icons-react-native';
import { BottomModalContainer } from '@/components/modals/BottomModalContainer';
import { BottomModalContent } from '@/components/modals/BottomModalContent';
import {
  NETWORK_ERROR_MODAL,
  SERVER_ERROR_MODAL,
  SERVER_TIMEOUT_MODAL,
} from './modalTypes';

type ModalContextType = {
  hideModal: (id?: string) => void;
  configureBottomModal: (
    content: ReactNode,
    id: string,
    isNotDismissable?: boolean,
    needsContainer?: boolean,
    presentationStyle?: PresentationStyle
  ) => void;
  isModalVisible: boolean;
  // configureNotificationsModal: (
  //     title: string,
  //     body: string,
  //     onPress: () => void,
  //     id: NotificationIds,
  //     props?: any
  // ) => void;
  // configurePopUpModal: (
  //     title: string,
  //     body: string,
  //     type: PopUpType,
  //     id: number,
  //     props: any
  // ) => void;
};

const ModalContext = createContext<ModalContextType>({
  hideModal: () => {},
  configureBottomModal: () => {},
  isModalVisible: false,
  // configureNotificationsModal: () => { },
  // configurePopUpModal: () => { }
});

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

type ModalConfiguration = {
  content: ReactNode;
  props: Partial<ModalProps>;
  id: string;
};

interface ModalProviderProps {
  children: ReactNode;
}

interface ModalProviderRef {
  hideModal: (id?: string) => void;
  configureBottomModal: (
    content: ReactNode,
    id: string,
    isNotDismissable?: boolean,
    needsContainer?: boolean
  ) => void;
  // configureNotificationsModal: (title: string, body: string, onPress: () => void, id: NotificationIds, props: any) => void;
  // configurePopUpModal: (title: string, body: string, type: PopUpType, id: number, props: any) => void;
}

export const ModalProvider = forwardRef<ModalProviderRef, ModalProviderProps>(
  ({ children }, ref) => {
    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<ReactNode | null>(null);
    const [modalProps, setModalProps] = useState<Partial<ModalProps> | null>(
      null
    );
    const [modalElements, setModalElements] = useState<ModalConfiguration[]>(
      []
    );

    const configureBottomModal = (
      content: ReactNode,
      id: string,
      isNotDismissable: boolean = false,
      needsContainer: boolean = true,
      presentationStyle?: PresentationStyle
    ) => {
      if (!modalElements.some((element) => element.id === id)) {
        const modalContent = needsContainer ? (
          <BottomModalContainer>{content}</BottomModalContainer>
        ) : (
          content
        );

        const modalProps: Partial<ModalProps> = {
          propagateSwipe: true,
          presentationStyle: presentationStyle,
          useNativeDriver: presentationStyle === 'pageSheet' ? true : undefined,
          hasBackdrop: presentationStyle === 'pageSheet' ? false : undefined,
          backdropOpacity: presentationStyle === 'pageSheet' ? undefined : 0.5,
          swipeDirection: !isNotDismissable ? ['down'] : [],
          onSwipeComplete: () =>
            !isNotDismissable ? setModalVisible(false) : {},
          useNativeDriverForBackdrop:
            presentationStyle === 'pageSheet' ? true : undefined,
          onBackdropPress: () =>
            !isNotDismissable ? setModalVisible(false) : {},
          hideModalContentWhileAnimating:
            presentationStyle === 'pageSheet' ? true : undefined,
          animationIn: 'slideInUp',
          animationOut: 'slideOutDown',
          style: {
            justifyContent: 'flex-end',
            margin: 0,
            flex: 1,
          },
        };
        setModalElements((prevModalElements) =>
          !prevModalElements.some((element) => element.id === id)
            ? [
                ...prevModalElements,
                { content: modalContent, props: modalProps, id },
              ]
            : prevModalElements
        );
      }
    };

    // const configureNotificationsModal = (
    //     title: string,
    //     body: string,
    //     onPress: () => void,
    //     id: NotificationIds,
    //     props?: any
    // ) => {

    //     let content;
    //     if (NotificationIds.PROFESSIONAL_SHIFT_READY_TO_REVIEW === id) {
    //         content = <BottomModal
    //             title={title}
    //             subTitle={body}
    //             buttonTitle={'Valorar'}
    //             icon={< IconStar size={64} color={'#149EF2'} > </IconStar>} // make it generic for notification
    //             onPress={() => {
    //                 onPress()
    //                 hideModal()
    //             }
    //             }
    //         />
    //     } else if (NotificationIds.MGM_REWARD === id) {
    //         content = <BottomModal
    //             title={title}
    //             subTitle={body}
    //             buttonTitle={'Entendido'}
    //             icon={null}
    //             onPress={() => {
    //                 onPress()
    //                 hideModal()
    //             }
    //             }
    //         >
    //             <View>
    //                 <StyledText
    //                     style={{
    //                         ...typographyStyles.heading.large,
    //                         textAlign: 'center',
    //                         marginBottom: SPACE_VALUES.medium
    //                     }}>
    //                     {props.rewardAmount}
    //                 </StyledText>
    //                 <StyledText
    //                     style={{
    //                         ...typographyStyles.info.caption,
    //                         textAlign: 'left',
    //                         marginBottom: SPACE_VALUES.medium,
    //                         color: '#848DA9'
    //                     }}>
    //                     {props.subtitle}
    //                 </StyledText>
    //             </View>
    //         </BottomModal>
    //     }

    //     if (content) {
    //         const modalContent = (
    //             <BottomModalContainer>
    //                 {content}
    //             </BottomModalContainer>
    //         )
    //         const modalProps: Partial<ModalProps> = {
    //             backdropOpacity: 0.5,
    //             swipeDirection: ['down'],
    //             onSwipeComplete: () => setModalVisible(false),
    //             onBackdropPress: () => setModalVisible(false),
    //             animationIn: "slideInUp",
    //             animationOut: "slideOutDown",
    //             style: {
    //                 justifyContent: 'flex-end',
    //                 margin: 0,
    //                 flex: 1,
    //             }
    //         }
    //         setModalElements(prevModalElements =>
    //             (!prevModalElements.some(element => element.id === id) ? [...prevModalElements, { content: modalContent, props: modalProps, id }] : prevModalElements)
    //         )
    //     }

    // }

    // const configurePopUpModal = (
    //     title: string,
    //     body: string,
    //     type: PopUpType,
    //     id: number,
    //     props: any
    // ) => {

    //     const PopUpProps = {
    //         [PopUpType.PROFESSIONAL_ACCOUNT_BECOME_HEALTHY]: {
    //             content: <AccountHealthModal
    //                 icon={<IconUserCheck size={24} color={'#2ABB36'} />}
    //                 title={title}
    //                 body={body}
    //                 backgroundColor={'#DEFAE0'}
    //                 onPress={() => {
    //                     hideModal()
    //                     markPopUpAsSeen(id)
    //                 }}
    //                 undoAction={() => {
    //                     navigate('ProfileStack', {
    //                         screen: 'AccountHealth'
    //                     })
    //                     hideModal()
    //                     markPopUpAsSeen(id)
    //                 }}
    //             />,
    //         },
    //         [PopUpType.PROFESSIONAL_ACCOUNT_BECOME_UNHEALTHY]: {
    //             content: <AccountHealthModal
    //                 icon={<IconUserCancel size={24} color={'#FFB81A'} />}
    //                 title={title}
    //                 body={body}
    //                 backgroundColor={'#FFF0C4'}
    //                 onPress={() => {
    //                     hideModal()
    //                     markPopUpAsSeen(id)
    //                 }}
    //                 undoAction={() => {
    //                     navigate('ProfileStack', {
    //                         screen: 'AccountHealth'
    //                     })
    //                     hideModal()
    //                     markPopUpAsSeen(id)
    //                 }}
    //             />,
    //         },
    //         [PopUpType.URGENT_SHIFT_DETAILS_AVAILABLE]: {
    //             content: <ShiftConfirmationModal
    //                 title={title}
    //                 subtitle={body}
    //                 shift={props.shiftClaim}
    //                 buttonTitle={ACKNOWLEDGE_LABEL}
    //                 dismissTitle={'Ver más'}
    //                 onPress={() => {
    //                     hideModal()
    //                     markPopUpAsSeen(id)
    //                 }}
    //                 onDismiss={() => {
    //                     navigate(
    //                         'ShiftClaimStack',
    //                         {
    //                             screen: 'ShiftClaimDetails',
    //                             params: {
    //                                 shiftId: props.shiftClaim.shiftId,
    //                                 shiftClaimId: props.shiftClaim.id,
    //                             }
    //                         }
    //                     )
    //                     hideModal()
    //                     markPopUpAsSeen(id)
    //                 }
    //                 }
    //             />
    //         },
    //         [PopUpType.APP_UPGRADE_SUGGESTION]: {
    //             content: <BottomModal
    //                 title={title}
    //                 subTitle={body}
    //                 buttonTitle={UPDATE_APP_BUTTON_LABEL}
    //                 undoTitle={DISMISS_LABEL}
    //                 iconBackGroundColor='#BAE3FE'
    //                 icon={<LivoIcon name='refresh' size={64} color={'#149EF2'} />}
    //                 onPress={() => {
    //                     handleLinkPress(props.data.appUpgradingSuggestion.appStoreLink)
    //                     hideModal()
    //                     markPopUpAsSeen(id)
    //                 }}
    //                 undoAction={() => {
    //                     hideModal()
    //                     markPopUpAsSeen(id)
    //                 }
    //                 }
    //             />
    //         }
    //     }

    //     const modalContent = (
    //         <BottomModalContainer>
    //             {PopUpProps[type].content}
    //         </BottomModalContainer>
    //     )

    //     const modalProps: Partial<ModalProps> = {
    //         backdropOpacity: 0.5,
    //         // swipeDirection: ['down'],
    //         onSwipeComplete: () => {
    //             // markPopUpAsSeen(id)
    //             // setModalVisible(false)
    //         },
    //         onBackdropPress: () => {
    //             // setModalVisible(false)
    //             // markPopUpAsSeen(id)
    //         },
    //         animationIn: "slideInUp",
    //         animationOut: "slideOutDown",
    //         style: {
    //             justifyContent: 'flex-end',
    //             margin: 0,
    //             flex: 1,
    //         }
    //     }
    //     setModalElements(prevModalElements => {
    //         if (!prevModalElements.some(element => element.id === 'POP_UP_' + id)) {
    //             return [...prevModalElements, { content: modalContent, props: modalProps, id: 'POP_UP_' + id }]
    //         } else {
    //             return prevModalElements
    //         }
    //     })
    // }
    const hideModal = (id?: string): Promise<void> => {
      return new Promise((resolve) => {
        setModalVisible(false);
        setModalElements((prevModalElements) => {
          const newModalElements = prevModalElements.slice(1);
          return newModalElements;
        });
        setTimeout(() => {
          resolve();
        }, 250);
      });
    };

    useEffect(() => {
      if (modalElements.length > 0) {
        setModalContent(modalElements[0].content);
        setModalProps(modalElements[0].props);
        setModalVisible(true);
      }
    }, [modalElements]);

    useImperativeHandle(
      ref,
      () => ({
        hideModal,
        configureBottomModal,
        // configureNotificationsModal,
        // configurePopUpModal,
      }),
      [
        hideModal,
        configureBottomModal,
        isModalVisible,
        // configureNotificationsModal, configurePopUpModal
      ]
    );

    return (
      <ModalContext.Provider
        value={{
          hideModal,
          configureBottomModal,
          isModalVisible,
          // configureNotificationsModal, configurePopUpModal
        }}
      >
        {children}
        {modalContent ? (
          <Modal
            avoidKeyboard
            animationOutTiming={300}
            {...modalProps}
            isVisible={isModalVisible}
            onDismiss={() => hideModal()}
          >
            {modalContent}
          </Modal>
        ) : null}
      </ModalContext.Provider>
    );
  }
);

let _modalProviderRef: ModalProviderRef | null = null;

export function setModalProviderRef(modalProviderRef: ModalProviderRef | null) {
  _modalProviderRef = modalProviderRef;
}

export function hideModal(id?: string) {
  _modalProviderRef?.hideModal(id);
}

export function configureBottomModal(content: ReactNode, id: string) {
  _modalProviderRef?.configureBottomModal(content, id);
}

// export function configureNotificationsModal(title: string, body: string, onPress: () => void, id: NotificationIds, props?: any) {
//     _modalProviderRef?.configureNotificationsModal(title, body, onPress, id, props);
// }

// export function configurePopUpModal(title: string, body: string, type: PopUpType, id: number, props: any) {
//     _modalProviderRef?.configurePopUpModal(title, body, type, id, props);
// }

export function configureErrorModal(
  title: string,
  body: string,
  id: string,
  props?: any
) {
  const errorProps = {
    [NETWORK_ERROR_MODAL]: {
      icon: <IconWifiOff size={64} color={'#149EF2'} />,
      iconBackGroundColor: '#BAE3FE',
      onPress: () => hideModal(),
      buttonTitle: i18next.t('common_acknowledge'),
    },
    [SERVER_ERROR_MODAL]: {
      icon: <IconMoodSad size={64} color={'#FFB320'} />,
      iconBackGroundColor: '#FFF0C6',
      onPress: () => hideModal(),
      buttonTitle: i18next.t('common_acknowledge'),
    },
    [SERVER_TIMEOUT_MODAL]: {
      icon: <IconCloudOff size={64} color={'#FFB320'} />,
      iconBackGroundColor: '#FFF0C6',
      onPress: () => hideModal(),
      buttonTitle: i18next.t('common_acknowledge'),
    },
  };

  _modalProviderRef?.configureBottomModal(
    <BottomModalContent
      title={title}
      subTitle={body}
      buttonTitle={
        errorProps[id as keyof typeof errorProps].buttonTitle ||
        i18next.t('common_acknowledge')
      }
      icon={errorProps[id as keyof typeof errorProps].icon}
      iconBackGroundColor={
        errorProps[id as keyof typeof errorProps].iconBackGroundColor
      }
      onPress={() => errorProps[id as keyof typeof errorProps].onPress()}
    />,
    id,
    true
  );
}
