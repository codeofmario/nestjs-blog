export interface Mapper<REQUEST_DTO, RESPONSE_DTO, MODEL> {
  fromDtoToModel(dto: REQUEST_DTO): MODEL;
  fromModelToDto(model: MODEL): RESPONSE_DTO;
}
