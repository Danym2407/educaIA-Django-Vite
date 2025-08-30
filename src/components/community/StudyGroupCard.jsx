
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const StudyGroupCard = ({ group }) => {
  const { toast } = useToast();
  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg hover:text-accent cursor-pointer">{group.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-2 line-clamp-3">{group.description}</p>
        <p className="text-xs text-muted-foreground">Miembros: {group.members}</p>
        <p className="text-xs text-muted-foreground">Próxima sesión: {group.nextSession}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => toast({title: "Unirse a Grupo", description:`Intentando unirse a ${group.name}`})}>
          Unirse al Grupo
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudyGroupCard;
  