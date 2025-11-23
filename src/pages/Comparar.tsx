import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const Comparar = () => {
  // Placeholder comparison data
  const comparisons = [
    {
      id: "1",
      name: "Funeraria San José",
      rating: 4.8,
      price: "€2,500",
      distance: "2.3 km",
      services: {
        traslado: true,
        velatorio: true,
        cremacion: true,
        flores: true,
        musica: false,
      },
    },
    {
      id: "2",
      name: "Memorial del Valle",
      rating: 4.5,
      price: "€2,200",
      distance: "3.1 km",
      services: {
        traslado: true,
        velatorio: true,
        cremacion: false,
        flores: true,
        musica: true,
      },
    },
    {
      id: "3",
      name: "Funeraria Centro",
      rating: 4.6,
      price: "€2,800",
      distance: "1.5 km",
      services: {
        traslado: true,
        velatorio: true,
        cremacion: true,
        flores: true,
        musica: true,
      },
    },
  ];

  const serviceLabels = {
    traslado: "Servicio de traslado",
    velatorio: "Sala de velatorio",
    cremacion: "Cremación",
    flores: "Arreglos florales",
    musica: "Música en vivo",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Comparador de Funerarias</h1>
            <p className="text-lg text-muted-foreground">
              Compara servicios, precios y valoraciones en un solo lugar
            </p>
          </div>

          <div className="overflow-x-auto">
            <Card className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-semibold">Característica</th>
                    {comparisons.map((comp) => (
                      <th key={comp.id} className="text-center py-4 px-4">
                        <div className="font-bold text-lg">{comp.name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Valoración</td>
                    {comparisons.map((comp) => (
                      <td key={comp.id} className="text-center py-4 px-4">
                        <span className="text-accent font-semibold">{comp.rating} ⭐</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Precio Base</td>
                    {comparisons.map((comp) => (
                      <td key={comp.id} className="text-center py-4 px-4">
                        <span className="text-xl font-bold">{comp.price}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Distancia</td>
                    {comparisons.map((comp) => (
                      <td key={comp.id} className="text-center py-4 px-4">
                        {comp.distance}
                      </td>
                    ))}
                  </tr>
                  {Object.entries(serviceLabels).map(([key, label]) => (
                    <tr key={key} className="border-b">
                      <td className="py-4 px-4 font-medium">{label}</td>
                      {comparisons.map((comp) => (
                        <td key={comp.id} className="text-center py-4 px-4">
                          {comp.services[key as keyof typeof comp.services] ? (
                            <Check className="h-5 w-5 text-accent mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="py-4 px-4"></td>
                    {comparisons.map((comp) => (
                      <td key={comp.id} className="text-center py-4 px-4">
                        <Button className="w-full">Seleccionar</Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Comparar;
