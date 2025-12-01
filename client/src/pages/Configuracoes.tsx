import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Settings, Shield, Bell, Database, FileText, Download } from "lucide-react";

export default function Configuracoes() {
  const [config, setConfig] = useState({
    nomeEmpresa: "DespachoSys Pro",
    email: "contato@despachosys.com.br",
    telefone: "(11) 3000-0000",
    endereco: "São Paulo, SP",
    cnpj: "00.000.000/0000-00",
    descricao: "Sistema ERP/CRM para gerenciamento de despachos",
    notificacoesEmail: true,
    notificacoesSMS: false,
    backupAutomatico: true,
    frequenciaBackup: "diaria",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      toast.loading("Gerando backup...");
      // Simular backup
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Backup realizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar backup");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
      </div>

      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações Gerais
          </CardTitle>
          <CardDescription>Informações básicas da empresa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nome da Empresa *</Label>
              <Input
                value={config.nomeEmpresa}
                onChange={(e) => setConfig({ ...config, nomeEmpresa: e.target.value })}
              />
            </div>
            <div>
              <Label>CNPJ</Label>
              <Input
                value={config.cnpj}
                onChange={(e) => setConfig({ ...config, cnpj: e.target.value })}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={config.email}
                onChange={(e) => setConfig({ ...config, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input
                value={config.telefone}
                onChange={(e) => setConfig({ ...config, telefone: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label>Endereço</Label>
              <Input
                value={config.endereco}
                onChange={(e) => setConfig({ ...config, endereco: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label>Descrição</Label>
              <Textarea
                value={config.descricao}
                onChange={(e) => setConfig({ ...config, descricao: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
          <CardDescription>Configure como você deseja receber notificações</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Notificações por Email</p>
                <p className="text-sm text-muted-foreground">Receba alertas importantes por email</p>
              </div>
              <input
                type="checkbox"
                checked={config.notificacoesEmail}
                onChange={(e) => setConfig({ ...config, notificacoesEmail: e.target.checked })}
                className="w-5 h-5"
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Notificações por SMS</p>
                <p className="text-sm text-muted-foreground">Receba alertas críticos por SMS</p>
              </div>
              <input
                type="checkbox"
                checked={config.notificacoesSMS}
                onChange={(e) => setConfig({ ...config, notificacoesSMS: e.target.checked })}
                className="w-5 h-5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup e Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup e Dados
          </CardTitle>
          <CardDescription>Gerencie backups do banco de dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Backup Automático</p>
                <p className="text-sm text-muted-foreground">Realiza backup automático do banco de dados</p>
              </div>
              <input
                type="checkbox"
                checked={config.backupAutomatico}
                onChange={(e) => setConfig({ ...config, backupAutomatico: e.target.checked })}
                className="w-5 h-5"
              />
            </div>
            {config.backupAutomatico && (
              <div className="p-3 border rounded-lg bg-muted">
                <Label>Frequência de Backup</Label>
                <select
                  value={config.frequenciaBackup}
                  onChange={(e) => setConfig({ ...config, frequenciaBackup: e.target.value })}
                  className="w-full mt-2 px-3 py-2 border rounded-md"
                >
                  <option value="horaria">A cada hora</option>
                  <option value="diaria">Diariamente</option>
                  <option value="semanal">Semanalmente</option>
                  <option value="mensal">Mensalmente</option>
                </select>
              </div>
            )}
          </div>
          <Button onClick={handleBackup} variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Fazer Backup Agora
          </Button>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Segurança
          </CardTitle>
          <CardDescription>Configurações de segurança do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-medium text-blue-900">Autenticação OAuth</p>
            <p className="text-sm text-blue-800 mt-1">
              O sistema utiliza autenticação OAuth da Manus para garantir segurança máxima.
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-medium text-green-900">Criptografia de Dados</p>
            <p className="text-sm text-green-800 mt-1">
              Todos os dados sensíveis são criptografados em trânsito e em repouso.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="font-medium text-yellow-900">Logs de Auditoria</p>
            <p className="text-sm text-yellow-800 mt-1">
              Todas as ações no sistema são registradas para auditoria.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sobre */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sobre o Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Versão</p>
              <p className="font-medium">2.0.0</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data de Lançamento</p>
              <p className="font-medium">Dezembro 2024</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Desenvolvido por</p>
              <p className="font-medium">DespachoSys Team</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Suporte</p>
              <p className="font-medium">suporte@despachosys.com.br</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
}
