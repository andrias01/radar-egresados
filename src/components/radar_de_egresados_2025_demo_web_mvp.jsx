import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Search, Download, Plus, Filter, Briefcase, Users } from "lucide-react";

// --- Mock data ---
const programas = [
  "Ingeniería de Sistemas",
  "Contaduría",
  "Administración",
  "Derecho",
  "Trabajo Social",
  "Ambiental",
  "Electrónica",
  "Inglés",
];

const competencias = [
  "Comunicación",
  "Trabajo en equipo",
  "Pensamiento crítico",
  "Tecnología",
  "Ética",
  "Inglés",
];

const radarData = competencias.map((c) => ({
  competencia: c,
  // perfil declarado por egresado
  declarado: Math.round(55 + Math.random() * 40),
  // perfil observado por empleador
  observado: Math.round(40 + Math.random() * 45),
}));

const brechas = radarData.map((d) => ({
  competencia: d.competencia,
  brecha: d.declarado - d.observado,
}));

const empresas = [
  { nombre: "Nacional de Chocolates", entrevistas: 7, satisfaccion: 82 },
  { nombre: "Bancolombia", entrevistas: 9, satisfaccion: 78 },
  { nombre: "Cámara de Comercio", entrevistas: 4, satisfaccion: 74 },
  { nombre: "Zona Franca", entrevistas: 3, satisfaccion: 69 },
];

const egresados = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  nombre: `Egresado ${i + 1}`,
  programa: programas[i % programas.length],
  anio: 2023 + (i % 3),
  empleabilidad6m: Math.round(50 + Math.random() * 45),
}));

// Termómetro simple (percepción global)
const percepcionGlobal = Math.round(
  radarData.reduce((acc, d) => acc + d.observado, 0) / radarData.length
);

// --- UI helpers ---
const PageSection = ({ title, children }) => (
  <section className="space-y-3">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
    </div>
    {children}
  </section>
);

export default function RadarEgresadosApp() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Topbar */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="size-8 rounded-2xl bg-neutral-800 grid place-content-center font-bold">R</div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold leading-none">Radar de Egresados 2025</h1>
            <p className="text-xs text-neutral-400">Modelo de brechas · Encuestas · Entrevistas · Visualizaciones</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Input className="pl-8 w-64 bg-neutral-900 border-neutral-800" placeholder="Buscar…" />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
            </div>
            <Button variant="secondary" className="bg-neutral-200 text-neutral-950 hover:bg-neutral-100">Compartir</Button>
            <Button className="gap-2"><Download className="h-4 w-4"/>Exportar</Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-12 gap-4">
        {/* Sidebar filtros */}
        <aside className="md:col-span-3 space-y-4">
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-base">Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Año</Label>
                <Select defaultValue="2025">
                  <SelectTrigger className="bg-neutral-950 border-neutral-800">
                    <SelectValue placeholder="Año" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-800">
                    {[2023, 2024, 2025].map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Programa</Label>
                <Select>
                  <SelectTrigger className="bg-neutral-950 border-neutral-800">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-800 max-h-64">
                    <SelectItem value="todos">Todos</SelectItem>
                    {programas.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vista</Label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2"><Checkbox id="v1" defaultChecked/><Label htmlFor="v1" className="text-sm">Radar</Label></div>
                  <div className="flex items-center gap-2"><Checkbox id="v2" defaultChecked/><Label htmlFor="v2" className="text-sm">Brechas</Label></div>
                  <div className="flex items-center gap-2"><Checkbox id="v3" defaultChecked/><Label htmlFor="v3" className="text-sm">Empleadores</Label></div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Peso de empleadores (ponderación)</Label>
                <Slider defaultValue={[60]} max={100} step={5} />
              </div>
              <Button variant="outline" className="w-full border-neutral-700"><Filter className="h-4 w-4 mr-2"/>Aplicar filtros</Button>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-base">Termómetro de percepción</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <div className="h-40 w-10 bg-neutral-800 rounded-2xl overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${percepcionGlobal}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    className="w-full bg-gradient-to-t from-green-500 to-lime-400"
                    style={{ minHeight: 10 }}
                  />
                </div>
                <div>
                  <p className="text-3xl font-bold leading-none">{percepcionGlobal}%</p>
                  <p className="text-xs text-neutral-400">Valoración promedio de empleadores</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-base">Acciones rápidas</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="secondary" className="justify-start gap-2 bg-neutral-200 text-neutral-900"><Plus className="h-4 w-4"/> Nuevo instrumento</Button>
              <Button variant="secondary" className="justify-start gap-2 bg-neutral-200 text-neutral-900"><Users className="h-4 w-4"/> Cargar egresados (CSV)</Button>
              <Button variant="secondary" className="justify-start gap-2 bg-neutral-200 text-neutral-900"><Briefcase className="h-4 w-4"/> Invitar empleadores</Button>
            </CardContent>
          </Card>
        </aside>

        {/* Main panels */}
        <section className="md:col-span-9 space-y-6">
          {/* KPIs */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Egresados encuestados", value: 236 },
              { label: "Empleadores entrevistados", value: 23 },
              { label: "Tasa de empleabilidad (6m)", value: "76%" },
              { label: "Brecha promedio", value: `${Math.round(
                  brechas.reduce((a,b)=>a+b.brecha,0)/brechas.length
                )}%` },
            ].map((k) => (
              <Card key={k.label} className="bg-neutral-900 border-neutral-800">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-neutral-400">{k.label}</CardTitle></CardHeader>
                <CardContent><p className="text-2xl font-semibold">{k.value}</p></CardContent>
              </Card>
            ))}
          </div>

          {/* Visualizaciones */}
          <Tabs defaultValue="radar" className="space-y-4">
            <TabsList className="bg-neutral-900 border border-neutral-800">
              <TabsTrigger value="radar">Radar de competencias</TabsTrigger>
              <TabsTrigger value="brechas">Brechas por competencia</TabsTrigger>
              <TabsTrigger value="empleadores">Empleadores</TabsTrigger>
              <TabsTrigger value="egresados">Egresados</TabsTrigger>
              <TabsTrigger value="instrumentos">Instrumentos</TabsTrigger>
            </TabsList>

            <TabsContent value="radar" className="space-y-4">
              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-base">Perfil declarado vs observado</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius={110}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="competencia" tick={{ fill: "#a3a3a3", fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#737373" }} />
                      <Radar name="Declarado" dataKey="declarado" fillOpacity={0.3} />
                      <Radar name="Observado" dataKey="observado" fillOpacity={0.3} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="brechas" className="space-y-4">
              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-base">Brecha (Declarado - Observado)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={brechas}>
                      <XAxis dataKey="competencia" tick={{ fill: "#a3a3a3", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#737373" }} />
                      <Tooltip />
                      <Bar dataKey="brecha" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="empleadores" className="space-y-4">
              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-base">Entrevistas de empleadores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    {empresas.map((e) => (
                      <div key={e.nombre} className="p-3 rounded-2xl border border-neutral-800 bg-neutral-950">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{e.nombre}</p>
                          <span className="text-xs text-neutral-400">{e.entrevistas} entrevistas</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-neutral-800 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-lime-400 to-green-500" style={{ width: `${e.satisfaccion}%` }} />
                        </div>
                        <p className="text-xs text-neutral-400 mt-1">Satisfacción {e.satisfaccion}%</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="egresados" className="space-y-4">
              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-base">Listado de egresados (muestra)</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-neutral-400">
                        <th className="py-2">Nombre</th>
                        <th>Programa</th>
                        <th>Año</th>
                        <th>Empleabilidad 6m</th>
                      </tr>
                    </thead>
                    <tbody>
                      {egresados.map((g) => (
                        <tr key={g.id} className="border-t border-neutral-800">
                          <td className="py-2">{g.nombre}</td>
                          <td>{g.programa}</td>
                          <td>{g.anio}</td>
                          <td>{g.empleabilidad6m}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instrumentos" className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-4">
                <Card className="bg-neutral-900 border-neutral-800">
                  <CardHeader>
                    <CardTitle className="text-base">Nueva encuesta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Título</Label>
                        <Input className="bg-neutral-950 border-neutral-800" placeholder="Encuesta de percepción empleadores"/>
                      </div>
                      <div className="space-y-1">
                        <Label>Programa</Label>
                        <Select>
                          <SelectTrigger className="bg-neutral-950 border-neutral-800"><SelectValue placeholder="General"/></SelectTrigger>
                          <SelectContent className="bg-neutral-900 border-neutral-800">
                            <SelectItem value="general">General</SelectItem>
                            {programas.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Pregunta ejemplo</Label>
                      <Textarea className="bg-neutral-950 border-neutral-800" placeholder="¿Cómo calificaría la competencia de comunicación de nuestros egresados?"/>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="anon" defaultChecked/>
                      <Label htmlFor="anon">Respuestas anónimas</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">Guardar borrador</Button>
                      <Button variant="secondary" className="flex-1 bg-neutral-200 text-neutral-900">Publicar</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-neutral-900 border-neutral-800">
                  <CardHeader>
                    <CardTitle className="text-base">Nueva entrevista</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Empresa</Label>
                        <Input className="bg-neutral-950 border-neutral-800" placeholder="Nombre de la empresa"/>
                      </div>
                      <div className="space-y-1">
                        <Label>Contacto</Label>
                        <Input className="bg-neutral-950 border-neutral-800" placeholder="Persona entrevistada"/>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Notas</Label>
                      <Textarea className="bg-neutral-950 border-neutral-800" placeholder="Hallazgos, compromisos, valoraciones"/>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">Guardar</Button>
                      <Button variant="secondary" className="flex-1 bg-neutral-200 text-neutral-900">Enviar consentimiento</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-4 pb-10 text-xs text-neutral-500">
        <p>Demo MVP · Radar de Egresados 2025 · Inspirado en tus apuntes (percepción de empleadores, modelo de brechas, entrevistas y termómetro por colores).</p>
      </footer>
    </div>
  );
}
