import {
  AvailabilityExplainerSection,
  BUSQUEDAS_FRECUENTES,
  CRITERIOS_CONFIANZA,
  CtaBand,
  ESTADISTICAS_DEMO,
  FeaturedMedicinesSection,
  HeroSection,
  HowItWorksSection,
  MEDICAMENTOS_DESTACADOS_DEMO,
  PASOS,
  ServicesSection,
  StatsStrip,
  SupportStrip,
  TERRITORIOS_DEMO,
} from "@/features/home";

export default function InicioPage() {
  return (
    <>
      <HeroSection territorios={TERRITORIOS_DEMO} busquedasFrecuentes={BUSQUEDAS_FRECUENTES} />
      <StatsStrip stats={ESTADISTICAS_DEMO} />
      <HowItWorksSection steps={PASOS} />
      <FeaturedMedicinesSection medicines={MEDICAMENTOS_DESTACADOS_DEMO} catalogCount={624} />
      <ServicesSection />
      <AvailabilityExplainerSection criteria={CRITERIOS_CONFIANZA} />
      <CtaBand />
      <SupportStrip />
    </>
  );
}
