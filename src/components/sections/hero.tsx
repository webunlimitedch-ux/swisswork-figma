import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Building2, Users } from 'lucide-react'

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">
          Der Schweizer Marktplatz für
          <span className="text-blue-600"> professionelle Dienstleistungen</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Verbinden Sie sich mit qualifizierten Freelancern und Unternehmen in der Schweiz. 
          Finden Sie die perfekten Partner für Ihre Projekte oder bieten Sie Ihre Expertise an.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/jobs">
            <Button size="lg" className="w-full sm:w-auto">
              <Search className="mr-2" size={20} />
              Jobs durchsuchen
            </Button>
          </Link>
          <Link href="/auth">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Building2 className="mr-2" size={20} />
              Als Dienstleister registrieren
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Projekte finden</h3>
            <p className="text-gray-600">
              Durchsuchen Sie hunderte von Projekten und finden Sie die perfekte Gelegenheit
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Experten finden</h3>
            <p className="text-gray-600">
              Verbinden Sie sich mit verifizierten Schweizer Dienstleistern und Unternehmen
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Erfolgreich zusammenarbeiten</h3>
            <p className="text-gray-600">
              Sichere Abwicklung und professionelle Zusammenarbeit auf höchstem Niveau
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}