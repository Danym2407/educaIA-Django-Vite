
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, StarHalf, ThumbsUp, Bookmark } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CourseRecommendationCard = ({ recommendation }) => {
  const { toast } = useToast();

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-current text-yellow-500" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-current text-yellow-500" />);
    }

    const emptyStarsCount = 5 - stars.length;
    for (let i = 0; i < emptyStarsCount; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-yellow-500" />);
    }
    return stars;
  };

  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg hover:text-accent cursor-pointer">{recommendation.title}</CardTitle>
        <p className="text-xs text-muted-foreground">Recomendado por {recommendation.user} • Categoría: {recommendation.category}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-2 line-clamp-3">{recommendation.review}</p>
        <div className="flex items-center space-x-1">
          {renderStars(recommendation.rating)}
          <span className="text-xs text-muted-foreground ml-1">({recommendation.rating.toFixed(1)})</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent" onClick={() => toast({title: "Interacción", description:"Te gusta esta recomendación."})}>
            <ThumbsUp className="mr-1 h-4 w-4" /> {recommendation.likes}
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent" onClick={() => toast({title: "Interacción", description:"Recomendación guardada."})}>
            <Bookmark className="mr-1 h-4 w-4" /> {recommendation.saves}
          </Button>
        </div>
        <Button variant="link" className="text-accent" onClick={() => toast({title: "Navegación", description:"Irías a la página del curso."})}>Ver Curso</Button>
      </CardFooter>
    </Card>
  );
};

export default CourseRecommendationCard;
  