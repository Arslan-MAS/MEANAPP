export class Post {

  public Title : String ;
  public Content :String;
  public Id? : String ;
  public ImagePath? : String ;
  public Creator: String ;
  constructor( title :String , content :String , id :String= "" , ImagePath= "", Creator ="" ) {
    this.Title = title ;
    this.Content = content ;
    this.Id = id;
    this.ImagePath = ImagePath;
    this.Creator= Creator ;
  }


}
