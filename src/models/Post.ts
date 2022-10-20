import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, UpdateQueryBuilder} from 'typeorm'

import User from './User';
import Category from './Category';

@Entity('posts')
class Post{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    title:string;
    
    @Column()
    body:string;

  @ManyToMany(()=>Category, category=>category.posts)
  @JoinTable()
    categories: Category[];

    @ManyToOne((type)=> User)
    @JoinColumn()
    author:User;
    
  

    @CreateDateColumn()
    created_at:Date;

    @UpdateDateColumn()
    updated_at:Date;

    @Column()
    preview:string;
}

export default Post;