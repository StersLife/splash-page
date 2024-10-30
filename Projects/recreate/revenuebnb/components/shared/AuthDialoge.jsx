import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';

const AuthDialoge = ({ children, isOpen, onOpenChange, label }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="hidden">
          <DialogTitle>{label}</DialogTitle>
        </div>
        <DialogClose className='flex w-min items-center justify-end'>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialoge;