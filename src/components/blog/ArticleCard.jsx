
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, User } from 'lucide-react';

const ArticleCard = ({ article }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <Link to={`/blog/${article.slug}`} className="block">
          {article.image && (
            <div className="aspect-video overflow-hidden">
              <img  
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
        </Link>
        <CardHeader className="p-4 sm:p-5">
          <div className="flex flex-wrap gap-1 mb-2">
            {article.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
          <Link to={`/blog/${article.slug}`}>
            <CardTitle className="text-lg sm:text-xl font-semibold leading-tight hover:text-accent transition-colors line-clamp-2">
              {article.title}
            </CardTitle>
          </Link>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 text-sm text-muted-foreground flex-grow">
          <p className="line-clamp-3">{article.description}</p>
        </CardContent>
        <CardFooter className="p-4 sm:p-5 border-t border-border text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={article.authorImage || `https://ui-avatars.com/api/?name=${article.author.replace(/\s/g, '+')}&background=random`} alt={article.author} />
              <AvatarFallback>{article.author.substring(0,1)}</AvatarFallback>
            </Avatar>
            <span>{article.author}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
            <span>{new Date(article.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ArticleCard;
  