
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ForumThreadCard = ({ thread }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start space-x-4 pb-3">
        <Avatar>
          <AvatarImage src={thread.avatar} alt={thread.user} />
          <AvatarFallback>{thread.user.substring(0,2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg hover:text-accent cursor-pointer">{thread.title}</CardTitle>
          <p className="text-xs text-muted-foreground">Por {thread.user} • {thread.lastActivity}</p>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{thread.snippet}</p>
        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {thread.tags.map(tag => <span key={tag} className="text-xs bg-secondary px-2 py-0.5 rounded-full">{tag}</span>)}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {thread.replies} respuestas
      </CardFooter>
    </Card>
  );
};

export default ForumThreadCard;
  