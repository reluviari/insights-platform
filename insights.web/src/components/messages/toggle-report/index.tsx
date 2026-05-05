import { updateReport } from "@src/services/reports";
import { toast } from "@src/utils/toast";
import React, { useCallback, useEffect, useState } from "react";

import { useAppDispatch } from "@src/store/hooks";

interface Props {
  onClose: () => void;
  reportId: string;
  isActive: boolean;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setConfirmText: (confirmText: string) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  setCancelText: (cancelText: string) => void;
}

const ToggleReport = (props: Props): JSX.Element => {
  const {
    onClose,
    reportId,
    isActive,
    setTitle,
    setDescription,
    setConfirmText,
    onSuccess,
    onError,
    setCancelText,
  } = props;
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const toggleReportStatus = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await dispatch(updateReport({ id: reportId, isActive: !isActive }));
      onSuccess(
        `O relatório ${
          isActive
            ? "não está mais disponível aos usuários."
            : "agora está disponível aos usuários."
        }`,
      );
    } catch (err) {
      onError(`Erro ao ${isActive ? "desativar" : "ativar"} o relatório.`);
    } finally {
      setIsLoading(false);
      onClose();
    }
  }, [dispatch, reportId, isActive, onClose, onSuccess, onError]);

  useEffect(() => {
    setTitle(isActive ? "Deseja desativar o relatório?" : "Deseja ativar o relatório?");
    setDescription(
      isActive
        ? "Isso impedirá que o cliente tenha acesso ao relatório."
        : "Isso permitirá que o cliente tenha acesso ao relatório.",
    );
    setConfirmText(isActive ? "Sim, desativar" : "Sim, ativar");
    setCancelText("Cancelar");
  }, [isActive, setTitle, setDescription, setConfirmText, setCancelText]);

  return null;
};

export default ToggleReport;
