export class Post {

  public Title : String ;
  public Content :String;
  public Id : String ;
  constructor( title :String , content :String , id :String= "" ) {
    this.Title = title ;
    this.Content = content ;
    this.Id = id;
  }

}
