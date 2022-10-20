import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, ManyToOne, JoinColumn, OneToMany} from 'typeorm'

import Post from './Post'
import User from './User';
@Entity('categories')
class Category{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;

    @ManyToMany(()=>Post, post=>post.categories)
    posts:Post[];

    @ManyToOne(type=>User, category=>Category )
    @JoinColumn()
    creator:User;

    @CreateDateColumn()
    created_at:Date;

}

export default Category;