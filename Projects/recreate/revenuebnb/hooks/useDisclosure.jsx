import { useCallback, useState } from 'react';

export const useDisclosure = (props = {}) => {
  const { 
    defaultIsOpen = false, 
    onOpen: onOpenProp, 
    onClose: onCloseProp 
  } = props;

  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const onOpen = useCallback(() => {
    setIsOpen(true);
    onOpenProp?.();
  }, [onOpenProp]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    onCloseProp?.();
  }, [onCloseProp]);

  const onToggle = useCallback(() => {
    const action = isOpen ? onClose : onOpen;
    action();
  }, [isOpen, onClose, onOpen]);

  const getDisclosureProps = useCallback(() => ({
    'aria-expanded': isOpen,
    'aria-controls': 'disclosure-content',
  }), [isOpen]);

  const getButtonProps = useCallback((props = {}) => ({
    ...getDisclosureProps(),
    onClick: onToggle,
    id: props.id ?? 'disclosure-button',
  }), [getDisclosureProps, onToggle]);

  const getContentProps = useCallback((props = {}) => ({
    id: props.id ?? 'disclosure-content',
    hidden: !isOpen,
  }), [isOpen]);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
    getDisclosureProps,
    getButtonProps,
    getContentProps,
  };
};