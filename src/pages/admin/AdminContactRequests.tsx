import { useState, useEffect } from 'react';
import { FaTrash, FaEye, FaEnvelope, FaPhone, FaUser, FaProjectDiagram } from 'react-icons/fa';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/admin/PaginationControls';
import { toast } from 'sonner';
import { contactRequestService, type ContactRequest } from '@/lib/db';

type StatusType = 'new' | 'read' | 'processed' | 'archived';
type ProjectType = 'landing' | 'business' | 'shop';

const AdminContactRequests = () => {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusType | 'all'>('all');

  const filteredRequests = statusFilter === 'all'
    ? requests
    : requests.filter(req => req.status === statusFilter);

  const {
    currentData: paginatedRequests,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    setCurrentPage,
  } = usePagination({ data: filteredRequests, itemsPerPage: 10 });

  useEffect(() => {
    loadRequests();
  }, []);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, setCurrentPage]);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const data = await contactRequestService.getAll();
      setRequests(data);
    } catch (error) {
      console.error('Error loading contact requests:', error);
      toast.error('Ошибка загрузки заявок');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (request: ContactRequest) => {
    setSelectedRequest(request);
    setIsDetailDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setRequestToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!requestToDelete) return;

    try {
      const success = await contactRequestService.delete(requestToDelete);
      if (success) {
        toast.success('Заявка удалена');
        loadRequests();
      } else {
        toast.error('Ошибка при удалении заявки');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Ошибка при удалении заявки');
    } finally {
      setIsDeleteDialogOpen(false);
      setRequestToDelete(null);
    }
  };

  const handleStatusChange = async (id: number, newStatus: StatusType) => {
    try {
      const updated = await contactRequestService.update(id, { status: newStatus });
      if (updated) {
        toast.success('Статус обновлен');
        loadRequests();
        if (selectedRequest?.id === id) {
          setSelectedRequest(updated);
        }
      } else {
        toast.error('Ошибка при обновлении статуса');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Ошибка при обновлении статуса');
    }
  };

  const getStatusBadge = (status: StatusType = 'new') => {
    const statusConfig = {
      new: { label: 'Новая', variant: 'default' as const, className: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
      read: { label: 'Прочитана', variant: 'secondary' as const, className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' },
      processed: { label: 'Обработана', variant: 'default' as const, className: 'bg-green-500/20 text-green-400 border-green-500/50' },
      archived: { label: 'Архив', variant: 'outline' as const, className: 'bg-gray-500/20 text-gray-400 border-gray-500/50' },
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getProjectTypeLabel = (type: ProjectType) => {
    const labels = {
      landing: 'Лендинг',
      business: 'Сайт-визитка',
      shop: 'Интернет-магазин',
    };
    return labels[type];
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <Card className="glass-effect p-8 text-center border-white/10">
          <p className="text-muted-foreground">Загрузка заявок...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl font-bold mb-2">Заявки с сайта</h1>
          <p className="text-muted-foreground">
            Просмотр и управление заявками из контактной формы
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusType | 'all')}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Фильтр по статусу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="new">Новые</SelectItem>
              <SelectItem value="read">Прочитанные</SelectItem>
              <SelectItem value="processed">Обработанные</SelectItem>
              <SelectItem value="archived">Архив</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <Card className="glass-effect p-12 text-center border-white/10">
          <FaEnvelope className="mx-auto text-4xl text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {statusFilter === 'all' ? 'Заявок пока нет' : 'Нет заявок с выбранным статусом'}
          </h3>
          <p className="text-muted-foreground">
            {statusFilter === 'all'
              ? 'Заявки из контактной формы будут отображаться здесь'
              : 'Попробуйте выбрать другой статус'}
          </p>
        </Card>
      ) : (
        <>
          {/* Desktop View - Table */}
          <div className="hidden md:block">
            <Card className="glass-effect p-0 border-white/10">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Имя</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Телефон</TableHead>
                      <TableHead>Тип проекта</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell className="font-medium">{request.name}</TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.phone}</TableCell>
                        <TableCell>{getProjectTypeLabel(request.project_type)}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {request.created_at
                            ? format(new Date(request.created_at), 'dd.MM.yyyy HH:mm', { locale: ru })
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(request)}
                            >
                              <FaEye className="mr-1" />
                              Детали
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(request.id!)}
                            >
                              <FaTrash className="mr-1" />
                              Удалить
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          {/* Mobile View - Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {paginatedRequests.map((request) => (
              <Card key={request.id} className="glass-effect p-4 border-white/10">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">ID: {request.id}</span>
                    <h3 className="font-bold text-lg leading-tight">{request.name}</h3>
                  </div>
                  <div>
                    {getStatusBadge(request.status)}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-sm flex items-center gap-2">
                    <FaEnvelope className="text-muted-foreground w-3 h-3" />
                    <span className="truncate">{request.email}</span>
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <FaPhone className="text-muted-foreground w-3 h-3" />
                    <span>{request.phone}</span>
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <FaProjectDiagram className="text-muted-foreground w-3 h-3" />
                    <span>{getProjectTypeLabel(request.project_type)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {request.created_at
                      ? format(new Date(request.created_at), 'dd.MM.yyyy HH:mm', { locale: ru })
                      : '-'}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewDetails(request)}
                  >
                    <FaEye className="mr-2" /> Детали
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDeleteClick(request.id!)}
                  >
                    <FaTrash className="mr-2" /> Удалить
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={nextPage}
            onPrev={prevPage}
          />
        </>
      )}

      {/* Dialog для просмотра деталей */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Детали заявки #{selectedRequest?.id}</DialogTitle>
            <DialogDescription>
              {selectedRequest?.created_at
                ? format(new Date(selectedRequest.created_at), 'dd.MM.yyyy в HH:mm', { locale: ru })
                : ''}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FaUser className="text-primary" />
                    <span>Имя</span>
                  </div>
                  <p className="font-medium">{selectedRequest.name}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FaEnvelope className="text-primary" />
                    <span>Email</span>
                  </div>
                  <p className="font-medium">{selectedRequest.email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FaPhone className="text-primary" />
                    <span>Телефон</span>
                  </div>
                  <p className="font-medium">{selectedRequest.phone}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FaProjectDiagram className="text-primary" />
                    <span>Тип проекта</span>
                  </div>
                  <p className="font-medium">{getProjectTypeLabel(selectedRequest.project_type)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Статус</span>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(selectedRequest.status)}
                  <Select
                    value={selectedRequest.status || 'new'}
                    onValueChange={(value) => handleStatusChange(selectedRequest.id!, value as StatusType)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Новая</SelectItem>
                      <SelectItem value="read">Прочитана</SelectItem>
                      <SelectItem value="processed">Обработана</SelectItem>
                      <SelectItem value="archived">Архив</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Сообщение</div>
                <div className="p-4 bg-muted/50 rounded-lg border border-white/10">
                  <p className="whitespace-pre-wrap">{selectedRequest.message}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog для подтверждения удаления */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить заявку?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Заявка будет удалена навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminContactRequests;
