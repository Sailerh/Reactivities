using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Activity Activity {get; set;}
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly  DataContext _context;
            public readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {     
                _context = context;
                _mapper = mapper;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activit = await _context.Activities.FindAsync(request.Activity.Id);
                if(activit != null)
                {
                    // activit.Title = request.Activity.Title ?? activit.Title;
                    _mapper.Map(request.Activity, activit);

                    await _context.SaveChangesAsync();
                }

                return Unit.Value;
            }
        }
    }
}