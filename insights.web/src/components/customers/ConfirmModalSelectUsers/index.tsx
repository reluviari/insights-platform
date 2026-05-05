import Button from "@src/components/common/Button";
import Loading from "@src/components/common/Loading";
import { Checkbox } from "@src/components/ui/checkbox";
import { useLazyGetUsersSearchQuery } from "@src/services/users";
import Image from "next/image";
import React, { ReactNode, useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import TableCheckbox from "../TableCheckbox";
import CheckboxAll from "../TableCheckbox/components/CheckboxAll";

interface ConfirmModalSelectUsersProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: any;
  title: string;
  description: string | ReactNode;
  confirmText: string;
  cancelText: string;
  children?: ReactNode;
  isLoading?: boolean;
  customerId: string;
}

export default function ConfirmModalSelectUsers({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  children,
  isLoading,
  customerId,
}: ConfirmModalSelectUsersProps) {
  const [dataTable, setDataTable] = useState<any>();
  const [checkedAll, setCheckedAll] = useState<boolean>(false);
  const [
    triggerSearch,
    { error: errorDataSearch, data: userDataSearch, isFetching: isLoadingSearch },
  ] = useLazyGetUsersSearchQuery();

  const { handleSubmit, setValue, getValues, control } = useForm({ mode: "onChange" });

  useEffect(() => {
    triggerSearch({ customers: [customerId] });
  }, [triggerSearch]);

  useEffect(() => {
    if (!!userDataSearch) {
      const copyData = userDataSearch;
      setDataTable(copyData);
    }
  }, [userDataSearch]);

  const handleConfirmClick = async (data: any) => {
    const userIds = Object.keys(data).filter(f => data[f]);
    onClose();
    onConfirm(userIds);
  };

  const handleCheckedAllChange = (checked: boolean) => {
    setCheckedAll(checked);
    dataTable.rows.forEach((row: any) => {
      setValue(row.id, checked);
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-[#313131] bg-opacity-70"
      onClick={onClose}
    >
      <div className="relative w-[900px] h-auto my-6 mx-auto" onClick={e => e.stopPropagation()}>
        <div className="border-0 rounded-xl shadow-modal relative flex flex-col w-full bg-neutral-0 outline-none focus:outline-none">
          <div className="flex justify-between items-start px-5 pt-8">
            <div className="flex items-center gap-2">
              <div className="bg-red-50 p-4 rounded-full flex justify-center items-center shrink-0">
                <Image src="/warning.svg" alt="Warning" width={24} height={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
                <p className="text-sm text-neutral-500 mt-1">{description}</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-neutral-800" onClick={onClose}>
              <Image src="/x_close.svg" alt="Close" width={24} height={24} />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 p-6">
              Usuários associados ao cliente
            </h3>
            <form id="selectUsersForm" onSubmit={handleSubmit(handleConfirmClick)}>
              <TableCheckbox
                columns={[
                  {
                    key: "name",
                    label: (
                      <div className="flex items-center gap-[35px]">
                        <Checkbox onCheckedChange={handleCheckedAllChange} checked={checkedAll} />
                        <p>Nome</p>
                      </div>
                    ),
                    render: (value, row) => {
                      return (
                        <div className="flex items-center gap-[35px]">
                          {CheckboxAll({
                            rowId: row.id,
                            control,
                            data: dataTable?.rows,
                            setCheckedAll,
                            getValues,
                          })}
                          <p>{row.name}</p>
                        </div>
                      );
                    },
                  },
                  {
                    key: "email",
                    label: "E-mail",
                  },
                  {
                    key: "departments",
                    label: "Grupo",
                    render: (value, row) => {
                      return (
                        <div className="flex gap-2 flex-wrap">
                          {value?.map((dp: any) => (
                            <p key={dp.id}>{dp.title}</p>
                          ))}
                        </div>
                      );
                    },
                  },
                ]}
                data={dataTable?.rows || []}
              />

              {(isLoadingSearch && dataTable?.rows.length < 1) ||
                (isLoadingSearch && (
                  <div className="w-full relative flex justify-center items-center">
                    <Loading color="fill-neutral-900" />
                  </div>
                ))}
              {!isLoadingSearch && dataTable?.rows.length < 1 && (
                <div className="flex justify-center items-center py-28">
                  <p>O cliente não possui usuários associados cadastrados na plataforma.</p>
                </div>
              )}
              <div className="flex justify-end gap-4 p-6">
                <Button variant="neutral" size="medium" className="w-[210px]" onClick={onClose}>
                  {cancelText}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="medium"
                  className="w-[210px]"
                  isLoading={isLoading}
                >
                  {confirmText}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
