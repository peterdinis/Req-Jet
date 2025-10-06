export type Header = {
  key: string;
  value: string;
};

export type SaveRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestData: {
    name: string;
    url: string;
    method: string;
    headers: Header[];
    body: string;
  };
};
